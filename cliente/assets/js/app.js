
var app = angular.module('miSitio', ['ui.router', 'angularFileUpload', 'satellizer', 'naif.base64']);


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

		.state("registro", {
			cache: false,
			url:"/registro",
			templateUrl:"templates/altaUsuario.html",
			controller:"RegistroCtrl"
		})
		
		// ADMIN
		.state('admin', {
			cache: true,
			url: '/admin',
			abstract: true,
			templateUrl: 'templates/admin/adminMenu.html',
			controller: 'AppCtrl'
		})

		.state('admin.adminGrillaUsuarios', {
			cache: false,
			url: '/grillaUsuarios',
			views: {
			  'contenido': {
			    templateUrl: 'templates/grillaUsuarios.html',
			    controller: 'AdminGrillaUsuariosCtrl'
			  }
			}
		})

		.state('admin.adminAltaUsuario', {
			cache: false,
			url: '/altaUsuario',
			views: {
			  'contenido': {
			    templateUrl: 'templates/altaUsuario.html',
			    controller: 'AdminAltaUsuarioCtrl'
			  }
			}
		})
				
			
	$urlRouterProvider.otherwise("/login");
});
	
// URL SERVIDOR
app.constant('URLServidor', 'http://localhost/UTN/Github/Torrellas.SPLab42016/servidor/');
// .constant('URLServidor', 'http://192.168.2.49/UTN/PPS/FPPSTorrellas/servidor/')
// .constant('URLServidor', 'http://trexasolutions.com/galle/')

// SUB-URL SERVICES
app.constant('URLServices', 'services/');
