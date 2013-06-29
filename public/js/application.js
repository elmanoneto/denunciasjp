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
			window.alert("É obrigatório preencher o resumo");
		}

		if(!attrs.denuncia) {
			erros.push('Denúncia é obrigatória.');
			window.alert("É obrigatório preencher a descrição");
		}

		if(attrs.resumo.length > 60){
			erros.push('Resumo excedeu o limite de caracteres.');
			window.alert("Resumo excedeu o limite de caracteres.");
		}

		return erros.length > 0 ? erros : false
	}
});

var Usuario = Backbone.Model.extend({
	defaults: {
		id: null,
		nome: null,
		email: null,
		permissao: 0
	},

	urlRoot: 'users'
});

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
					denuncia.data = moment(denuncia.data).fromNow(new Date());
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

	render: function () {
		var source = ($('#registrar-denuncia').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	},

	events: {
		'submit .form-registrar-denuncia': 'add'
	},

	add: function (e) {

		var d = new Denuncia();

		d.set({
			resumo: $('.denuncia-resumo').val(),
			endereco: $('.denuncia-endereco').val(),
			denuncia: $('.denuncia-descricao').val(),
			foto: $('.denuncia-foto').val()
		});

		var erros = [];
		d.on('invalid', function (options, errors){
			_.each(errors, function  (erro) {
				console.log(erro);
				erros.push(erro);
			})
			$(this.el).text(erros);
		});


		if(!d.isValid()){
			return false;
		}

		d.save();
		window.alert("Denúncia Adicionada com Sucesso");
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

		d.set({
			resumo: $('.usuario-nome').val(),
			endereco: $('.usuario-email').val()                                                                        
		});

		d.save();
		window.alert("Usuário Adicionado com Sucesso");


	}
});

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'registrar-denuncia': 'new',
		'denuncias/:id': 'view', 'cadastre-se': 'newUser'
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

Backbone.history.start();
