
var app = angular.module('miSitio', ['ui.router', 'angularFileUpload', 'satellizer', 'naif.base64', 'angular-growl', 'ngImgCrop']);


app.run(function($http) {

var defaultHTTPHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Al objeto $http le establecemos sus propiedades por defecto para utilice los headers que definimos arriba
  $http.defaults.headers.post = defaultHTTPHeaders;
});

app.config(function($stateProvider, $urlRouterProvider, $authProvider)
{
	

  	// Parametros de configuración
	// $authProvider.loginUrl = "http://trexasolutions.com/galle/services/usuarioService.php";
	$authProvider.loginUrl = "http://localhost/UTN/Github/Torrellas.SPLab42016/servidor/services/usuarioService.php";
	// $authProvider.loginUrl = "http://192.168.0.2/UTN/Github/Torrellas.SPLab42016/servidor/services/usuarioService.php";

	//$authProvider.signupUrl = "http://api.com/auth/signup";
	$authProvider.tokenName = "miToken";
	$authProvider.tokenPrefix = "login";


	$stateProvider

		.state("login", {
			cache: false,
			url:"/login",
			templateUrl:"templates/login.html",
			controller:"LoginCtrl"
		})

		.state("altaUsuario", {
			cache: false,
			url:"/altaUsuario",
			templateUrl:"templates/frmUsuario.html",
			controller:"AltaUsuarioCtrl"
		})


		
		// ADMIN
		.state('admin', {
			cache: false,
			url: '/admin',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'MenuCtrl'
		})

		.state('admin.adminGrillaUsuarios', {
			cache: false,
			url: '/grillaUsuarios',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillaUsuarios.html',
			    controller: 'GrillaUsuariosCtrl'
			  }
			}
		})

		.state('admin.adminAltaUsuario', {
			cache: false,
			url: '/altaUsuario',
			views: {
			  'contenido': {
			    templateUrl: 'templates/frmUsuario.html',
			    controller: 'AltaUsuarioCtrl'
			  }
			}
		})

		.state('admin.adminGrillaProductos', {
			cache: false,
			url: '/grillaProductos',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillaProductos.html',
			    controller: 'GrillaProductosCtrl'
			  }
			}
		})

		.state('admin.adminAltaProducto', {
			cache: false,
			url: '/altaProducto',
			views: {
			  'contenido': {
			    templateUrl: 'templates/frmProducto.html',
			    controller: 'AltaProductoCtrl'
			  }
			}
		})
				
			
	$urlRouterProvider.otherwise("/login");
});
