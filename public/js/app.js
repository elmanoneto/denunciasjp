// MODELS
Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

Backbone._sync = Backbone.sync;
Backbone.sync = function( method, model, options ) {
    var beforeSend = options.beforeSend;
 
    options = options || {};
  
    if ( method === "update" || method === "delete" || method === "patch" ) {
        options.beforeSend = function( xhr ) {
            xhr.setRequestHeader( "X-HTTP-Method-Override", method );
            if ( beforeSend ) { beforeSend.apply( this, arguments ); }    
            method = "create";                        
        };
    }
   
    return Backbone._sync( method, model, options );
};

var Denuncia = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: '/denuncias',
	url: '/denuncias'
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
	template: 'cadastrar',

	el: '#content',

	attributes: {
        action: 'denuncias',
        method: 'POST'
    },

	render: function(){
	  	var that = this;
	    $.get("/templates/denuncias/" + this.template + ".html", function(template){
	    	var html = $(template);
	      	that.$el.html(html);
	    });
	    return this;
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
  		
		

  		denuncia.save();

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
	console.log('Denúncia route.');
});

Backbone.history.start();