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
	},

	initialize: function  () {
		console.log('Criando Denúncia');
	}
});

denunciasjp.collections.Denuncias = Backbone.Collection.extend({
	model: denunciasjp.models.Denuncia,
	url: '/denuncias'
});

var List = new denunciasjp.collections.Denuncias();

denunciasjp.router.Denuncia = new Backbone.Router.extend({
	routes: {
		'/denuncias': 'getDenuncias'
	},

	getDenuncias: function  () {
		this.denunciaModel = new List();
	}
});

var denunciaRouter = new denunciasjp.router.Denuncia();

Backbone.history.start();
denunciaRouter.navigate();

denuncias.fetch();
