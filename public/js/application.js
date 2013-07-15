/*
	MODELS
			*/

/* DANILO PARTE 01
App.Models.Session = Backbone.Model.extend({
  defaults:
    access_token: null,
    user_id: null

  initialize: ->
    @load()

  authenticated: ->
    Boolean(@get("access_token"))

  # Saves session information to cookie
  save: (auth_hash)->
    $.cookie('user_id', auth_hash.id)
    $.cookie('access_token', auth_hash.access_token)

  # Loads session information from cookie
  load: ->
    @set
      user_id: $.cookie('user_id')
      access_token: $.cookie('access_token')
}); */


var Denuncia = Backbone.Model.extend({
	defaults: {
		resumo: '',
		autor: '',
		endereco: '',
		foto: '',
		denuncia: ''
	},

	urlRoot: '/denuncias',

	validate: function (attrs) {
		var erros = [];

		if(!attrs.resumo) {
			erros.push('Resumo é obrigatório.');
		}

		if(!attrs.denuncia) {
			erros.push('Descrição é obrigatória.');
		}

		if(attrs.resumo.length > 50){
			erros.push('Resumo excedeu o limite de caracteres.');
		}

		if(attrs.foto != ""){
			if(attrs.foto.split('.')[1] != 'jpg'){
				erros.push('Formato de arquivo inválido.');
			}
		}

		return erros.length > 0 ? erros : false
	},

	votar: function () {
		if(this.relevancia == null) {
			this.save({relevancia: 1})
			console.log(this.get('relevancia'));
		} else {
			var relevancia = this.get('relevancia');
			this.save({relevancia: relevancia + 1});
			console.log(this.get('relevancia'));
		}
		
		return false;
	}
});

var Usuario = Backbone.Model.extend({
	defaults: {
		id: "",
		nome: "",
		email: "",
		login: "",
		senha: "",
		logado: false
	},

	isLogged: function  () {
		this.logado = true;
	},	

	urlRoot: '/usuarios',

	validate: function (attrs) {
		var erros = [];

		if(!attrs.nome) {
			erros.push('Nome é obrigatório.');
		}

		if(!attrs.email) {
			erros.push('Email é obrigatório.');
		}

		if(!attrs.login) {
			erros.push('Login é obrigatório.');
		}
		if(!attrs.senha) {
			erros.push('Senha é obrigatória.');
		}

		return erros.length > 0 ? erros : false
	}
});

/*
	COLLECTIONS
				*/

var D = new Backbone.Model.extend({urlRoot: '/denuncias'});

var Denuncias = Backbone.Collection.extend({
	model: Denuncia,
	url: '/denuncias'
});

var Usuarios = Backbone.Collection.extend({
	model: Usuario,
	url: '/usuarios'
});

var ListaBusca = Backbone.Collection.extend({
	model: Denuncia,
	url: '/busca'
});

/*
	VIEWS
			*/
var Busca = Backbone.View.extend({
	el: '.busca',

	events: {
		'click .form-busca': 'busca'
	},

	busca: function () {
		var busca = $('input[name=buscar]').val();
		if(busca == "") {
			return false;
		}

		var denuncias = new Denuncias();
		this.el = '.conteudo';
		var that = this;
		denuncias.fetch({
			success: function (denuncias) {
				$('input[name=buscar]').val('');
				var js = denuncias.toJSON();
				var list = [];
				_.each(js, function (denuncia) {
					if(denuncia.denuncia.search(busca) != -1) {
						list.push(denuncia);
					}else{
						delete denuncia;
					}
				});
				console.log(list);
				var source = ($('#resultado-busca').html());
				var template = Handlebars.compile(source);
				$(that.el).html(template({denuncias: list}));
			}
		});
		return false;
	}
});

var DenunciasRecentes = Backbone.View.extend({
	el: '.conteudo',

	events: {
		'keyup .form-busca': 'busca',
	},

	render: function () {
		var that = this;
		var denuncias = new Denuncias();
		denuncias.fetch({
			success: function (denuncias){
				var js = denuncias.toJSON();
				_.each(js, function  (denuncia) {
					denuncia.data = moment(denuncia.data).fromNow();
				});
				var source = ($('#denuncias-list').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncias: js}));
			}
		});		
	},

	busca: function () {
		console.log('haha');
	},
});

var RegistrarDenuncia = Backbone.View.extend({
	el: '.conteudo',

	render: function (event) {
		var source = ($('#registrar-denuncia').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
		var contador = 50;
		$('.contador').html(contador);
	},

	events: {
		'click .btn-registrar-denuncia': 'registrar',
		'keyup .denuncia-resumo': 'contador',
		'keyup .denuncia-endereco': 'autocomplete'
	},

	registrar: function () {
		var denuncia = new Denuncia();

		var resumo = $('.denuncia-resumo').val();
		var endereco = $('.denuncia-endereco').val();
		var descricao  = $('.denuncia-descricao').val();
		var foto =  $('.denuncia-foto').val();

		denuncia.set({
			resumo: $('.denuncia-resumo').val(),
			endereco: $('.denuncia-endereco').val(),
			denuncia: $('.denuncia-descricao').val(),
			foto: $('.denuncia-foto').val(),
		});

		var erros = {};
		denuncia.on('invalid', function (options, errors){
			_.each(errors, function  (erro, i) {
				erros['erro' + i] = erro;
			})
			return false;
		});

		if(!denuncia.isValid()){
			var that = this;
			var source = ($('#registrar-denuncia').html());
			var template = Handlebars.compile(source);
			that.$el.html(template({erros: erros}));
			var contador = 50;
			$('.contador').html(contador);
			$('.denuncia-resumo').val(resumo);
			$('.denuncia-endereco').val(endereco);
			$('.denuncia-descricao').val(descricao);
			return false;
		}
	},

	contador: function () {
		var contador = 50;
		$('.contador').html(contador);
		var tam = $('.denuncia-resumo').val().length;

		var real = contador - tam;
		if (real < 0) {
			$('.contador').css('color', 'red');
		} else {
			$('.contador').css('color', 'black');
		}
		$('.contador').html(contador - tam);
	},

	autocomplete: function () {
		$(".denuncia-endereco").geocomplete();
	}
});

var VisualizarDenuncia = Backbone.View.extend({
	el: '.conteudo',

	render: function (options) {
		var that = this;
		var denuncia = new Denuncia({id: options.id});

		// this.latlng = new google.maps.LatLng(this.latitude, this.longitude);

  //       var myOptions = {
  //           zoom: 4,
  //           center: this.latlng,
  //           mapTypeId: google.maps.MapTypeId.ROADMAP
  //       };

  //       var mapElem = $(".conteudo");	
		// var map = new google.maps.Map(mapElem,mapOptions);
        

		denuncia.fetch({
			success: function (denuncia){
				var js = denuncia.toJSON();
				js.data = moment(js.data).format('DD/MM/YYYY');
				var source = ($('#visualizar-denuncia').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncia: js}));
			}
		});		
	},

	events: {
		'click .swipebox': 'dialog',
		'click .denunciard': 'denunciar'
	},

	dialog: function () {
		$('.swipebox').colorbox({rel: 'swipebox'});
	},

	denunciar: function (ev) {
		var id = $(ev.target).data('pancakes');
		var denuncia = new Denuncia({id: id});
		denuncia.fetch();
		denuncia.votar();
	}
});

var CadastrarUsuario = Backbone.View.extend({
	el: '.conteudo',

	render: function () {

		var source = ($('#cadastre-se').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
		var map = L.map('.map').setView([51.505, -0.09], 13);
		L.tileLayer('http://{s}.tile.cloudmade.com/ 2d8dec9fc2314ea4ba0578b96114e2a2/997/256/{z}/{x}/{y}.png', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		    maxZoom: 18
		}).addTo(map);
	},

	events: {
		'click .btn-cadastrar-usuario': 'add'
	},

	add: function () {

		var user = new Usuario();

		var nome = $('.usuario-nome').val();
		var email = $('.usuario-email').val();
		var login = $('.usuario-login').val();
		var senha =  $('.usuario-senha').val();

		user.set({
			nome: $('.usuario-nome').val(),
			email: $('.usuario-email').val(),
			login: $('.usuario-login').val(),
			senha: $('.usuario-senha').val()                                                                        
		});

		var erros = {};
		user.on('invalid', function (options, errors){
			_.each(errors, function  (erro, i) {
				erros['erro' + i] = erro;
			})
			return false;
		});

		if(!user.isValid()){
			var that = this;
			var source = ($('#cadastre-se').html());
			var template = Handlebars.compile(source);
			that.$el.html(template({erros: erros}));
			$('.usuario-nome').val(nome);
			$('.usuario-email').val(email);
			$('.usuario-login').val(login);
			$('.usuario-senha').val(senha);
			return false;
		}

		if(user.save()){
			Backbone.history.go('/#');
		}

		return false;
	},

	dialog: function () {
		$('.swipebox').colorbox({rel: 'swipebox'});
	}
});

var ComoFunciona = Backbone.View.extend({
	el: '.conteudo',

	render: function () {
		var source = ($('#como-funciona').html());
		var template = Handlebars.compile(source);
		$(this.el).html(template);
	}
});

var MinhasDenuncias = Backbone.View.extend({
	el: '.conteudo',

	render: function () {
		var denuncias = new Denuncias();
		var that = this;
		denuncias.fetch({
			success: function (denuncias) {
				var js = denuncias.toJSON();
				_.each(js, function  (denuncia) {
					denuncia.data = moment(denuncia.data).fromNow();
				});
				var source = ($('#minhas-denuncias').html());
				var template = Handlebars.compile(source);
				that.$el.html(template({denuncias: js}));
			}
		})
	}
});

/*
	ROTAS 
			*/

var Router = Backbone.Router.extend({
	routes: {
		'': 'home',
		'registrar-denuncia': 'new',
		'denuncias/:id': 'view',
		'cadastre-se': 'newUser',
		'denunciar/:id': 'denunciar',
		'como-funciona': 'comofunciona',
		'busca': 'busca',
		'denuncias': 'denuncias'
	}
});

var registrarDenuncia = new RegistrarDenuncia();

var denunciasRecentes = new DenunciasRecentes();

var visualizarDenuncia = new VisualizarDenuncia();

var cadastrarUsuario = new CadastrarUsuario();

var comoFunciona = new ComoFunciona();

var busca = new Busca();

var minhasDenuncias = new MinhasDenuncias();

var router = new Router();

router.on('route:home', function(){
	denunciasRecentes.render();
	console.log('Página Principal');
});

router.on('route:new', function(){
	registrarDenuncia.render();
	console.log('Registrar Denúncia');
})

router.on('route:view', function (id) {
	visualizarDenuncia.render({id: id});
	console.log('Visualizar denúncia');
});

router.on('route:newUser', function () {
	cadastrarUsuario.render();
	console.log('Cadastrar Usuário');
});

router.on('route:denunciar', function (id) {
	var denuncias = new Denuncias();
	d = denuncias.get({id: id});
	console.log(d);
	var denuncia = new Denuncia({id: id});
	denuncia.fetch({
		success: function  () {
			var n = denuncia.get('denuncias') + 1;
			denuncia.set({denuncias: n});
			console.log(denuncia.get('denuncias'));
		}
	});
	//denuncia.set({denuncias: denuncia.denuncias++});
});

router.on('route:comofunciona', function () {
	comoFunciona.render();
});

router.on('route:busca', function () {
	busca.render();
});
	
router.on('router:login', function () {
	login.render();
});

router.on('route:denuncias', function () {
	console.log('Denúncias!');
	minhasDenuncias.render();
});


Backbone.history.start();

/* DANILO PARTE 02

App.start = ->
  @session = new App.Models.Session()
  if @session.authenticated()
    # redirect to user page
  else
    # launch a login form
*/
