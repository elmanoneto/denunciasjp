window.HomeView = Backbone.View.extend({
	el: '.teste',

	initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (employee) {
            $(self.el).append(new DenunciaListItemView({model:denuncia}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        _.each(this.model.models, function (employee) {
            $(this.el).append(new DenunciaListItemView({model:denuncia}).render().el);
        }, this);
        return this;
    }
});

window.DenunciaListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});