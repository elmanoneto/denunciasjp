var denunciasjp = {};
denunciasjp.models = {};
denunciasjp.collections = {};
denunciasjp.views = {};
denunciasjp.router = {};

denunciasjp.models.Denuncia = Backbone.Model.extend({
	defaults: {
		id: null,
		autor: null,
		resumo: null,
		denuncia: null,
		endereco: null,
		foto: null,
		data: null
	}
});

denunciasjp.collections.Denuncias = Backbone.Collection.extend({
	model: denunciasjp.models.Denuncia,
	url: '/denuncias'
});

var denuncias = new denunciasjp.collections.Denuncias();

denuncias.create();

denuncias.fetch();

denunciasjp.router.Denuncia = new Backbone.Router.extend({
	routes: {
		'/denuncias/': 'getDenuncias'
	},

	getDenuncias: function  () {
		this.denunciaModel = new List();
	}
});

var denunciaRouter = new denunciasjp.router.Denuncia();

Backbone.history.start();
denunciaRouter.navigate();
