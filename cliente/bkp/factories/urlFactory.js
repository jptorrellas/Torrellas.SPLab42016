angular.module('miSitio')

.factory('urlFactory', function () {
	
	var varServidor         = 'http://localhost/UTN/Github/Torrellas.SPLab42016/servidor/';
	// var varServidor         = 'http://192.168.0.2/UTN/Github/Torrellas.SPLab42016/servidor/';
	var varServices         = 'services/';

	var varImgPerfilUsuario = 'img/usuarios/';
	var varImgProducto      = 'img/productos/';

	var varWsUsuario        =  'usuarioService.php';
	var varWsProducto        =  'productoService.php';

	return {
 		servidor		 : varServidor,
 		services         : varServidor + varServices,
 		imgPerfilUsuario : varServidor + varImgPerfilUsuario,
 		imgProducto      : varServidor + varImgProducto,
 		wsUsuario        : varServidor + varServices + varWsUsuario,
 		wsProducto        : varServidor + varServices + varWsProducto
	}
});