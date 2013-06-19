window.Denuncia = Backbone.Model.extend({
	urlRoot: '/denuncias',

	initialize: function  () {
		this.reports = new DenunciaCollection();
	}
});

window.DenunciaCollection = new Backbone.Collection.extend({
	model: Denuncia,

	url: '/denuncias'
});