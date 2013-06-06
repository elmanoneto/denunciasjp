require.config({
	paths: {
		'jquery': 'libs/jquery',
		'underscore': 'libs/underscore',
		'backbone': 'libs/backbone',
		'json2js': 'libs/json2js',
		'handlebars': 'libs/handlebars'
	},

	shim :{
		'models': {
			deps: ['backbone']
		},
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			exports
		}
	}
});