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
			erros.push('Denúncia é obrigatória.');
		}

		if(attrs.resumo.length > 60){
			erros.push('Resumo excedeu o limite de caracteres.');
		}

		return erros.length > 0 ? erros : false
	}
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
		this.model = new Denuncia();
		this.collection = new Denuncias();
	},

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

	},

	exibirErros: function (errors) {
		_.each(errors, function (error){
			alert(error);
		});
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'registrar-denuncia': 'new'
	}
});

var registrarDenuncia = new RegistrarDenuncia();

var denunciasRecentes = new DenunciasRecentes();

var router = new Router();

router.on('route:home', function(){
	denunciasRecentes.render();
	console.log('Página Principal');
});

router.on('route:new', function(){
	registrarDenuncia.render();
	console.log('Registrar Denúncia');
})

Backbone.history.start();