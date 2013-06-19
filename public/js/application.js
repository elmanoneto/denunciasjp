//Backbone.emulateHTTP = true;

var Denuncia = Backbone.Model.extend({
	urlRoot: '/denuncias',

	defaults: {
	 	autor: '',
	 	resumo: '',
	 	denuncia: '',
	 	endereco: '',
	 	foto: '',
	 	data: ''
	}

	// validate: function(attrs) {
	//     errors = [];
	//     if (_.isEmpty(attrs.resumo)) {
	//       errors.push("Resumo é obrigatório");
	//     }
	//     if (_.isEmpty(attrs.descricao)) {
	//       errors.push("Descrição é obrigatória");
	//     }
	//     if (attrs.resumo > 60) {
	//     	errors.push("Resumo excedeu o limite de caracteres.");
	//     }
	//     return _.any(errors) ? errors : null;
 //  	}
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

	initialize: function () {
		this.denuncia = this.model;
	},

	render: function () {
		var source = ($('#registrar-denuncia').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	},

	events: {
		'submit .form-registrar-denuncia': 'add'
	},

	add: function () {
		var resumo = $('.denuncia-resumo').val();
		var endereco = $('.denuncia-endereco').val();
		var denuncia = $('.denuncia-descricao').val();
		var foto = $('.denuncia-foto').val();

		// this.model = new Denuncia();

		this.model.set({
			resumo: resumo,
			endereco: endereco,
			denuncia: denuncia,
			foto: foto
		});

		this.model.save({
			success: function  () {
				console.log('Salvou');
			},
			error: function () {
				console.log('Erro');
			}
		});

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