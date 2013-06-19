Backbone.emulateHTTP = true;

var Denuncia = Backbone.Model.extend({
	defaults: {
		idAttribute: "_id",
		autor: "",
		resumo: "",
		denuncia: "",
		endereco: "",
		foto: "",
		data: ""
	},

	urlRoot: '/denuncias'
});

var Denuncias = Backbone.Collection.extend({
	url: '/denuncias',
	model: Denuncia
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

	render: function () {
		var source = ($('#registrar-denuncia').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	},

	events: {
		'submit .form-registrar-denuncia': 'add'
	},

	add: function () {
		this.model.set({
			resumo: $('.denuncia-resumo').val(),
			endereco: $('.denuncia-endereco').val(),
			denuncia: $('.denuncia-descricao').val(),
			foto: $('.denuncia-foto').val()
		});


		this.model.save();
		window.history.back();
		return false;
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