//Backbone.emulateHTTP = true;

var Denuncia = Backbone.Model.extend({
	defaults: {
		resumo: '',
		autor: '',
		endereco: '',
		foto: '',
		denuncia: ''
	},

	urlRoot: '/denuncias',

	validate: function (attrs) {
		var erros = [];

		if(!attrs.resumo) {
			erros.push('Resumo é obrigatório.');
		}

		if(!attrs.denuncia) {
			erros.push('Descrição é obrigatória.');
		}

		if(attrs.resumo.length > 50){
			erros.push('Resumo excedeu o limite de caracteres.');
		}

		return erros.length > 0 ? erros : false
	}
});

var Usuario = Backbone.Model.extend({
	defaults: {
		id: null,
		nome: null,
		email: null,
		logado: false
	},

	isLogged: function  () {
		this.logado = true;
	},	

	urlRoot: 'usuarios'
});

var D = new Backbone.Model.extend({urlRoot: '/denuncias'});

var Denuncias = Backbone.Collection.extend({
	model: Denuncia,
	url: '/denuncias'
});

var DenunciasRecentes = Backbone.View.extend({
	el: '.conteudo',

	render: function () {
		var that = this;
		var denuncias = new Denuncias();
		denuncias.fetch({
			success: function (denuncias){
				var js = denuncias.toJSON();
				_.each(js, function  (denuncia) {
					denuncia.data = moment(denuncia.data).fromNow();
				});
				var source = ($('#denuncias-list').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncias: js}));
			}
		});		
	}
});

var RegistrarDenuncia = Backbone.View.extend({
	el: '.conteudo',

	initialize: function () {
		var contador = 50;
		$('.contador').html();
	},

	render: function () {
		var source = ($('#registrar-denuncia').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	},

	events: {
		'submit .form-registrar-denuncia': 'add',
		'keyup .denuncia-resumo': 'contador'
	},

	add: function (e) {

		var d = new Denuncia();

		d.set({
			resumo: $('.denuncia-resumo').val(),
			endereco: $('.denuncia-endereco').val(),
			denuncia: $('.denuncia-descricao').val(),
			foto: $('.denuncia-foto').val()
		});

		var erros = {};
		d.on('invalid', function (options, errors){
			_.each(errors, function  (erro, i) {
				erros['erro' + i] = erro;
			})
		});

		if(!d.isValid()){
			var that = this;
			var source = ($('#registrar-denuncia').html());
			var template = Handlebars.compile(source);
			that.$el.html(template({erros: erros}));
			return false;
		}

		d.save();

	},

	contador: function () {
		var contador = 50;
		$('.contador').html(contador);
		var tam = $('.denuncia-resumo').val().length;

		var real = contador - tam;
		if (real < 0) {
			$('.contador').css('color', 'red');
		} else {
			$('.contador').css('color', 'black');
		}
		$('.contador').html(contador - tam);
	}
});

var VisualizarDenuncia = Backbone.View.extend({
	el: '.conteudo',

	render: function (options) {
		var that = this;
		var denuncia = new Denuncia({id: options.id});
		denuncia.fetch({
			success: function (denuncia){
				var js = denuncia.toJSON();
				js.data = moment(js.data).format('DD/MM/YYYY');
				var source = ($('#visualizar-denuncia').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncia: js}));
			}
		});		
	}
});

var cadastrarUsuario = Backbone.View.extend({
	el: '.conteudo',

	render: function () {
		var source = ($('#cadastre-se').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	},

	events: {
		'submit .form-cadastre-se': 'add'
	},

	add: function (e) {

		var user = new Usuario();

		user.set({
			nome: $('.usuario-nome').val(),
			email: $('.usuario-email').val(),
			login: $('.usuario-login').val(),
			senha: $('.usuario-senha').val()                                                                        
		});

		var errosIncluirUsuario = [];

		user.on('invalid', function (options, errors){
			_.each(errors, function  (erro) {
				console.log(erro);
				erros.push(erro);
			})
			$(this.el).text(erros);
		});


		if(!user.isValid()){

			window.alert("Usuário já existente");
			return false;
		}
		else{
		user.save();
		window.alert("Usuário Adicionado com Sucesso");
		}

	}
});

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'registrar-denuncia': 'new',
		'denuncias/:id': 'view', 'cadastre-se': 'newUser',
		'denunciar/:id': 'denunciar'
	}
});


var registrarDenuncia = new RegistrarDenuncia();

var denunciasRecentes = new DenunciasRecentes();

var visualizarDenuncia = new VisualizarDenuncia();

var cadastrarUsuario = new cadastrarUsuario();

var router = new Router();

router.on('route:home', function(){
	denunciasRecentes.render();
	console.log('Página Principal');
});

router.on('route:new', function(){
	registrarDenuncia.render();
	console.log('Registrar Denúncia');
})

router.on('route:view', function (id) {
	visualizarDenuncia.render({id: id});
	console.log('Visualizar denúncia');
});

router.on('route:newUser', function () {
	cadastrarUsuario.render();
	console.log('Cadastrar Usuário');
});

router.on('route:denunciar', function (id) {
	var denuncias = new Denuncias();
	d = denuncias.get({id: id});
	console.log(d);
	var denuncia = new Denuncia({id: id});
	denuncia.fetch({
		success: function  () {
			var n = denuncia.get('denuncias') + 1;
			denuncia.set({denuncias: n});
			console.log(denuncia.get('denuncias'));
		}
	});
	//denuncia.set({denuncias: denuncia.denuncias++});
});

Backbone.history.start();
