
var app = angular.module('miSitio', ['ui.router', 'angularFileUpload', 'satellizer']);//esto permite incluir el módulo 'ui.router' al módulo 'starter'

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
		
		// ADMIN //
		.state('admin', {
			cache: false,
			url: '/Admin',
			abstract: true,
			templateUrl: 'templates/admin/adminMenu.html',
			controller: 'AppCtrl'
		})

		.state('admin.adminInicio', {
			cache: true,
			url: '/inicio',
			views: {
			  'menuContent': {
			    templateUrl: 'templates/admin/adminInicio.html',
			    controller: 'AdminInicioCtrl'
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
// SUB-URL USERS PERFIL IMG
app.constant('URLimgPerfilUsuario', 'img/usuarios/');