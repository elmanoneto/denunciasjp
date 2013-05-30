var denunciasjp = {};
denunciasjp.models = {};
denunciasjp.collections = {};
denunciasjp.views = {};
denunciasjp.router = {};

denunciasjp.models.Denuncia = Backbone.Model.extend({

});

denunciasjp.collections.Denuncias = Backbone.Collection.extend({
	model: denunciasjp.models.Denuncia,
	url: '/denuncias'
});

var denuncias = new denunciasjp.collections.Denuncias();

denunciasjp.router.Denuncia = new Backbone.Router.extend({
	routes: {
		'/denuncias': 'getDenuncias'
	},

	getDenuncias: function  () {
		console.log('Getting Denúncias');
	}
});

var denunciaRouter = new denunciasjp.router.Denuncia();
Backbone.history.start();
denunciaRouter.navigate();


denuncias.fetch();
