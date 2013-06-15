// MODELS
Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

var Denuncia = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: '/denuncias',
	
	defaults: {
		autor: '',
		resumo: '',
		denuncia: '',
		endereco: '',
		foto: '',
		data: ''
	}
});

// COLLECTTIONS
var Denuncias = Backbone.Collection.extend({
	url: '/denuncias'
});

// VIEWS
var DenunciasList = Backbone.View.extend({
	el: '.denuncias-recentes',
	render: function  () {
		var that = this;
		var denuncias = new Denuncias();
		denuncias.fetch({	
			success: function  (denuncias) {
				var js = denuncias.toJSON();
				var source = ($('#denuncias-list').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncias: js}));
			}
		});
	}
});

var FormDenuncia = Backbone.View.extend({
	el: '.denuncias-recentes',

	attributes: {
        action: 'denuncias',
        method: 'POST'
    },

	render: function(){
	  	templateUrl: '/templates/denuncias/cadastrar.html',

    initialize: function() {
      AppView.__super__.initialize.apply(this); // Call parent initializator

      ...
    },
    // You should rename render function to _render
    _render: function() {
      // Render here, template available in this.template variable (this.template(model))
      this.$('.denuncias-recentes').html(this.template({...}));
    },

	    // $.get("/templates/denuncias/" + this.template + ".html", function(template){
	    // 	var html = $(template);
	    //   	that.$el.html(html);
	    // });
  	},

  	events: {
  		'click #submit': 'submitForm'
  	},	
	
	submitForm: function  (e) {
		
  		e.preventDefault();

  		var resumo = $('input#resumo').val();
	    var denuncia = $('input#denuncia').val();

  		var denuncia = new Denuncia({
  			resumo: resumo,
	    	denuncia: denuncia
  		});
  		
		
  		console.log('hahe');
  	}
 
});

var formDenuncia = new FormDenuncia();


// ROUTERS
var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'registrar-denuncia': 'formDenuncia'
	},

	formDenuncia: function  () {
		formDenuncia.render();
		console.log('haha');
	}
});

// APP

var denunciasList = new DenunciasList();

var router = new Router();

router.on('route:home', function () {
	denunciasList.render();
	console.log('Home route.');
});

router.on('route:registrar-denuncia', function () {
	formDenuncia.render();
	console.log('Denúncia route.');
});

Backbone.history.start();