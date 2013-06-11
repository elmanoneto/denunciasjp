// MODELS
var Denuncia = Backbone.Model.extend({
	urlRoot: '/denuncias'
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

  render: function(){
  	var that = this;
    $.get("/templates/denuncias/" + this.template + ".html", function(template){
      var html = $(template);
      that.$el.html(html);
    });
    return this;
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