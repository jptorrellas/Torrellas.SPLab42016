angular.module('miSitio')

.service('usuarioService', function($http, urlFactory) {
	
	var respuesta = {};	

	this.altaUsuario = function(data) { 

    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ 
  				//console.log(retorno);			   
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "Ya existe un usuario con ese email";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
    				return respuesta;	
    			}	
  			},
  			function(error){ 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.guardarUsuarioEditado = function(data) { 

    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ 
  				console.log(retorno);			   
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
    				respuesta.datos = retorno.data.datos;
	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error. no existe el usuario") {
    				respuesta.estado = false;
    				respuesta.mensaje = "El usuario que intenta editar ya no existe en el sistema. Por favor actualice la grilla.";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
    				return respuesta;	
    			}	
  			},
  			function(error){ 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.borrarUsuario = function(data) {

    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
    	.then(
  			function(retorno){         
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
    				respuesta.mensaje = "Usuario Borrado!";
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "Hubo un problema al intentar borrar usuario.";
    				return respuesta;
    			}	
  			},
  			function(error){ 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};

	this.recuperaPassword = function(data) {

    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
    	.then(
  			function(retorno){         
    			if (retorno.data.mensaje != "error") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Acabamos de enviarte el password. Revisa tu casilla de e-mail :)';
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "El email ingresado no pertenece a ningún usuario del sistema";
    				return respuesta;
    			}	
  			},
  			function(error){ 
    			respuesta.estado = false;
    			respuesta.mensaje = "Problema de conexión con el servidor.";
    			return respuesta;
  			}
    	);
	};	

	this.traerTodosLosUsuarios = function(data) {

    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
    	.then(
  			function(retorno){    ;
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
			function(error){ 
				respuesta.estado = false;
				respuesta.mensaje = "Problema de conexión con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
    	);
	};

	

	// this.modificaInformacion = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){         
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
 //  			function(retorno){ 
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "Problema de conexión con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };

	// this.modificaFotoPerfil = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 30000 })
 //    	.then(
 //  			function(retorno){         
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
 //  			function(retorno){ 
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "Problema de conexión con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };

	// this.eliminaCuenta = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){         
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
 //  			function(retorno){ 
 //    			respuesta.estado = false;
 //    			respuesta.mensaje = "Problema de conexión con el servidor.";
 //    			return respuesta;
 //  			}
 //    	);
	// };	

	// this.actualizaListaVehiculos = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){    ;
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
	// 		function(retorno){ 
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "Problema de conexión con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
 //    	);
	// };


	// this.actualizaListaHistorial = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
 //    	.then(
 //  			function(retorno){ 
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
	// 		function(retorno){ 
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "Problema de conexión con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
 //    	);
	// };


	// this.traeVehiculosClienteInicio = function(data){

	

 //    	return $http.post(urlFactory.wsUsuario, data,  { timeout: 10000 })
	//     .then(
	// 		function(retorno){    ;
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
	// 		function(retorno){ 
	// 			respuesta.estado = false;
	// 			respuesta.mensaje = "Problema de conexión con el servidor.";
	// 			respuesta.datos = 'error';
	// 			return respuesta;
	// 		}
	// 	);
	// };
});

