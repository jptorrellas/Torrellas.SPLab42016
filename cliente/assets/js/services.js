angular.module('miSitio')
// Mi Factory para usuario
.factory('usuarioFactory', function () {
	// Objeto JSON respuesta utilizado para todas las respuestas al controller.
	var respuesta = {};
	
	return {
 		payload : {},
 		password : {},

 		validarFormLogin : function (data){

			var arrayValidaciones= [];
			var mensajeValidaciones="";

			// Validaciones
			// Validación Email
			if (data.email == "" || data.email == null || !(/\S+@\S+\.\S+/.test(data.email))) {
				arrayValidaciones.push("e-mail inválido");
			}
			// Validación Password
			if (data.password == "" || data.password == null) {
				arrayValidaciones.push("contraseña inválida");
			}
			
			if (arrayValidaciones.length > 0) {
				for (var i = 0; i < arrayValidaciones.length; i++) {
					if (i == arrayValidaciones.length-1) {
						mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+".";
					}
			  	else{
			    		mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+", ";
			 		}
				}

				respuesta.estado = false;
				respuesta.mensaje = "Error: "+mensajeValidaciones;
				return respuesta;
			}
			if (arrayValidaciones.length == 0) {
				respuesta.estado = true;
				respuesta.mensaje = "";
				return respuesta;
			}
		},

	 	validarFormUsuario : function (data){

			var arrayValidaciones= [];
			var mensajeValidaciones="";

			// Validaciones
			// Validación Nombre
			if (data.nombre == "" || data.nombre == null || !(/^[a-zA-Z ]{1,25}$/.test(data.nombre))) {
				arrayValidaciones.push("nombre inválido");
			}
			// Validación Apellido
			if (data.apellido == "" || data.apellido == null || !(/^[a-zA-Z ]{1,25}$/.test(data.apellido))) {
				arrayValidaciones.push("apellido inválido");
			}
			// Validación Email					
			if (data.email == "" || data.email == null || !(/\S+@\S+\.\S+/.test(data.email)) ) {
				arrayValidaciones.push("e-mail inválido");
			}
			// Validación Password
			if (data.password1 == "" || data.password1 == null || data.password2 == "" || data.password2 == null) {
				arrayValidaciones.push("contraseña inválida");
			}
			if (data.password1 != data.password2) {
				arrayValidaciones.push("Las contraseñas deben ser iguales");
			}
			
			if (arrayValidaciones.length > 0) {
				for (var i = 0; i < arrayValidaciones.length; i++) {
					if (i == arrayValidaciones.length-1) {
						mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+".";
					}
			  	else{
			    		mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+", ";
			 		}
				}

				respuesta.estado = false;
				respuesta.mensaje = "Error: "+mensajeValidaciones;
				return respuesta;
			}
			if (arrayValidaciones.length == 0) {
				respuesta.estado = true;
				respuesta.mensaje = "";
				return respuesta;
			}
		},

		validarEmail : function (data){

			var arrayValidaciones= [];
			var mensajeValidaciones="";

			// Validaciones Email						
			if (data.email == "" || data.email == null || !(/\S+@\S+\.\S+/.test(data.email))) {
				arrayValidaciones.push("e-mail inválido");
			}
			
			if (arrayValidaciones.length > 0) {
				for (var i = 0; i < arrayValidaciones.length; i++) {
					if (i == arrayValidaciones.length-1) {
						mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+".";
					}
			  	else{
			    		mensajeValidaciones = mensajeValidaciones+arrayValidaciones[i]+", ";
			 		}
				}

				respuesta.estado = false;
				respuesta.mensaje = "Error: "+mensajeValidaciones;
				return respuesta;
			}
			if (arrayValidaciones.length == 0) {
				respuesta.estado = true;
				respuesta.mensaje = "";
				return respuesta;
			}
		}
	}
})

.service('usuarioService', function($http, URLServidor, URLServices){
	
	var respuesta = {};

	this.recuperaPassword = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje != "error") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Acabamos de enviarle el password. Revise su e-mail :)';
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

	this.registro = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
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
  			function(retorno){ // Función a ejecutarse en caso de fallo
    			respuesta.estado = false;
    			respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
    			return respuesta;
  			}
    	);
	};	

	this.modificaInformacion = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Información modificada! :)';

	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Problema al intentar modificar información. Vuelva a intentarlo pasados unos minutos.";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data != "error") {
    				console.log(retorno.data);
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
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

	this.modificaFotoPerfil = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 30000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			respuesta.mensaje = 'Foto Modificada! :)';
	    			respuesta.datos = retorno.data.datos;

	    			return respuesta;
    			}
    			if (retorno.data.mensaje == "error") {
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Problema al intentar modificar la foto. Vuelva a intentarlo pasados unos minutos.";
    				return respuesta;
    			}
    			if (retorno.data.mensaje != "ok" && retorno.data.mensaje != "error") {
    				console.log(retorno.data);
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR DESCONOCIDO";
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

	this.eliminaCuenta = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito        
    			if (retorno.data.mensaje == "ok") {
    				respuesta.estado = true;
	    			return respuesta;
    			}
    			else{
    				respuesta.estado = false;
    				respuesta.mensaje = "ERROR: Problema al intentar eliminar cuenta.";
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

	this.actualizaListaVehiculos = function(data){

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
					respuesta.mensaje = "No tiene vehículos asocicados.";
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
			function(retorno){ // Función a ejecutarse en caso de fallo
				respuesta.estado = false;
				respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
    	);
	};


	this.actualizaListaHistorial = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
    	.then(
  			function(retorno){ // Función a ejecutarse en caso de éxito
	  			// console.log(retorno);
				if (retorno.data.mensaje == "ok") {
					respuesta.estado = true;
	    			respuesta.mensaje = 'Lista actualizada';
	    			respuesta.datos = retorno.data.datos;
	    			return respuesta;
				}

				if (retorno.data.mensaje == "error") {
					respuesta.estado = false;
					respuesta.mensaje = "No tiene historial de "+data.reporte.toUpperCase();+".";
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
			function(retorno){ // Función a ejecutarse en caso de fallo
				respuesta.estado = false;
				respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
    	);
	};


	this.traeVehiculosClienteInicio = function(data){

		var urlCompleta = URLServidor + URLServices + "usuarioService.php";

    	return $http.post(urlCompleta, data,  { timeout: 10000 })
	    .then(
			function(retorno){ // Función a ejecutarse en caso de éxito   ;
				// console.log(retorno);
				if (retorno.data.mensaje == "ok") {
					respuesta.estado = true;
					respuesta.mensaje = 'Lista actualizada';
					respuesta.datos = retorno.data.datos;
					return respuesta;
				}

				if (retorno.data.mensaje == "error") {
					respuesta.estado = false;
					respuesta.mensaje = "No tiene vehículos asocicados.";
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
			function(retorno){ // Función a ejecutarse en caso de fallo
				respuesta.estado = false;
				respuesta.mensaje = "ERROR: Problema de conexion con el servidor.";
				respuesta.datos = 'error';
				return respuesta;
			}
		);
	};
});

