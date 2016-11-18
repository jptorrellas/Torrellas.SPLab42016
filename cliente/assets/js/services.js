angular.module('miSitio')
// Mi Factory para usuario
.factory('usuarioFactory', function () {
	// Objeto JSON respuesta utilizado para todas las respuestas al controller.
	var respuesta = {};
	
	return {
 		payload : {},
 		password : {}
	}
})

.service('usuarioService', function($http, URLServidor, URLServices) {
	
	var respuesta = {};	

	this.altaUsuario = function(data) { 

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ 
			   
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Usuario Registrado. Ya puede acceder al sistema :)';

	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Ya existe el usuario.";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
    				return respuesta;	
    			}	
  			},
  			function(error){ // Función a ejecutarse en caso de fallo
    			respuesta.estado = false;
    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.borrarUsuario = function(data) {

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
    				respuesta.mensaje = "Usuario Borrado!";
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Problema al intentar borrar usuario.";
    				return respuesta;
    			}	
  			},
  			function(retorno){ // Función a ejecutarse en caso de fallo
    			respuesta.estado = false;
    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
    			return respuesta;
  			}
    	);
	};	

	this.recuperaPassword = function(data) {

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje != "error") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Acabamos de enviarte el password. Revisa tu casilla de e-mail :)';
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Usuario no encontrado.";
    				return respuesta;
    			}	
  			},
  			function(retorno){ // Función a ejecutarse en caso de fallo
    			respuesta.estado = false;
    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
    			return respuesta;
  			}
    	);
	};	

	this.traerTodosLosUsuarios = function(data) {

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito   ;
				if (retorno.data.mensaje == "ok") {
					respuesta.estado = true;
	    			respuesta.mensaje = 'Lista actualizada';
	    			respuesta.datos = retorno.data.datos;
	    			return respuesta;
				}

				if (retorno.data.mensaje == "error") {
					respuesta.estado = false;
					respuesta.mensaje = "No hay usuarios para mostrar";
					respuesta.datos = 'error';
					return respuesta;
				}
				if (retorno.data.mensaje != "ok" && retorno.data != "error") {
					respuesta.estado = false;
					respuesta.mensaje = "ERROR DESCONOCIDO";
					respuesta.datos = 'error';
					return respuesta;	
				}	
			},
			function(error){ // Función a ejecutarse en caso de fallo
				respuesta.estado = false;
				respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
    	);
	};

	

	// this.modificaInformacion = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){ // Función a ejecutarse en caso de éxito        
 //    			if (retorno.data.mensaje == "ok") {
 //    				respuesta.estado = true;
	//     			respuesta.mensaje = 'Información modificada! :)';

	//     			return respuesta;
 //    			}
 //    			if (retorno.data.mensaje == "error") {
 //    				respuesta.estado = false;
 //    				respuesta.mensaje = "ERROR: Problema al intentar modificar información. Vuelva a intentarlo pasados unos minutos.";
 //    				return respuesta;
 //    			}
 //    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
 //    				console.log(retorno.data);
 //    				respuesta.estado = false;
 //    				respuesta.mensaje = "ERROR DESCONOCIDO";
 //    				return respuesta;	
 //    			}	
 //  			},
 //  			function(retorno){ // Función a ejecutarse en caso de fallo
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };

	// this.modificaFotoPerfil = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 30000 })
 //    	.then(
 //  			function(retorno){ // Función a ejecutarse en caso de éxito        
 //    			if (retorno.data.mensaje == "ok") {
 //    				respuesta.estado = true;
	//     			respuesta.mensaje = 'Foto Modificada! :)';
	//     			respuesta.datos = retorno.data.datos;

	//     			return respuesta;
 //    			}
 //    			if (retorno.data.mensaje == "error") {
 //    				respuesta.estado = false;
 //    				respuesta.mensaje = "ERROR: Problema al intentar modificar la foto. Vuelva a intentarlo pasados unos minutos.";
 //    				return respuesta;
 //    			}
 //    			if (retorno.data.mensaje != "ok" && retorno.data.mensaje != "error") {
 //    				console.log(retorno.data);
 //    				respuesta.estado = false;
 //    				respuesta.mensaje = "ERROR DESCONOCIDO";
 //    				return respuesta;	
 //    			}	
 //  			},
 //  			function(retorno){ // Función a ejecutarse en caso de fallo
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };

	// this.eliminaCuenta = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){ // Función a ejecutarse en caso de éxito        
 //    			if (retorno.data.mensaje == "ok") {
 //    				respuesta.estado = true;
	//     			return respuesta;
 //    			}
 //    			else{
 //    				respuesta.estado = false;
 //    				respuesta.mensaje = "ERROR: Problema al intentar eliminar cuenta.";
 //    				return respuesta;
 //    			}	
 //  			},
 //  			function(retorno){ // Función a ejecutarse en caso de fallo
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };	

	// this.actualizaListaVehiculos = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){ // Función a ejecutarse en caso de éxito   ;
	// 			if (retorno.data.mensaje == "ok") {
	// 				respuesta.estado = true;
	//     			respuesta.mensaje = 'Lista actualizada';
	//     			respuesta.datos = retorno.data.datos;
	//     			return respuesta;
	// 			}

	// 			if (retorno.data.mensaje == "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "No tiene vehículos asocicados.";
	// 				respuesta.datos = 'error';
	// 				return respuesta;
	// 			}
	// 			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "ERROR DESCONOCIDO";
	// 				respuesta.datos = 'error';
	// 				return respuesta;	
	// 			}	
	// 		},
	// 		function(retorno){ // Función a ejecutarse en caso de fallo
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
 //    	);
	// };


	// this.actualizaListaHistorial = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){ // Función a ejecutarse en caso de éxito
	//   			// console.log(retorno);
	// 			if (retorno.data.mensaje == "ok") {
	// 				respuesta.estado = true;
	//     			respuesta.mensaje = 'Lista actualizada';
	//     			respuesta.datos = retorno.data.datos;
	//     			return respuesta;
	// 			}

	// 			if (retorno.data.mensaje == "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "No tiene historial de "+data.reporte.toUpperCase();+".";
	// 				respuesta.datos = 'error';
	// 				return respuesta;
	// 			}
	// 			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "ERROR DESCONOCIDO";
	// 				respuesta.datos = 'error';
	// 				return respuesta;	
	// 			}	
	// 		},
	// 		function(retorno){ // Función a ejecutarse en caso de fallo
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
 //    	);
	// };


	// this.traeVehiculosClienteInicio = function(data){

	// 	var urlCompleta = URLServidor + URLServices + "usuarioService.php";

 //    	return $http.post(urlCompleta, data,  { timeout: 10000 })
	//     .then(
	// 		function(retorno){ // Función a ejecutarse en caso de éxito   ;
	// 			// console.log(retorno);
	// 			if (retorno.data.mensaje == "ok") {
	// 				respuesta.estado = true;
	// 				respuesta.mensaje = 'Lista actualizada';
	// 				respuesta.datos = retorno.data.datos;
	// 				return respuesta;
	// 			}

	// 			if (retorno.data.mensaje == "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "No tiene vehículos asocicados.";
	// 				respuesta.datos = 'error';
	// 				return respuesta;
	// 			}
	// 			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
	// 				respuesta.estado = false;
	// 				respuesta.mensaje = "ERROR DESCONOCIDO";
	// 				respuesta.datos = 'error';
	// 				return respuesta;	
	// 			}	
	// 		},
	// 		function(retorno){ // Función a ejecutarse en caso de fallo
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
	// 	);
	// };
});

