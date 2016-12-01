<?php 
/**
*************************************
* WEB SERVICE                       *
*************************************
* Version: 1.0.2                    *
* Fecha:   09/11/2016               *
* Autor:   Juan Pablo Torrellas     *
*************************************
*/	
	
// Incluye todos los archivos necesarios
require_once('../ws/includeAll.php');

// RECIBE PETICION
$jsonObjeto = file_get_contents("php://input");

$objRecibido = json_decode($jsonObjeto);

// Array que se utilizará para devolver mensaje y data al cliente
$respuesta = [];
$respuesta['mensaje'] = '';
$respuesta['datos'] = '';

// Instancia un objeto Crud
$crud = new Crud;
/**
 * AYUDA FUNCIONES CRUD: tODOS LOS PARAMETROS SON STRING
 * 
 * insert($tabla, $campos, $valores)
 * select($campos, $tabla, $condiciones)
 * selectList($campos, $tabla, $condiciones)
 * selectJoin($campos, $tabla1, $tabla2, $condiciones)
 * update($tabla, $camposYvalores, $condiciones)
 * delete($tabla, $condiciones)
*/

switch ($objRecibido->accion) {
	
	case 'login':

		$usuario = $crud->select("*", "usuarios", "email = '$objRecibido->email' && password = '$objRecibido->password' && nombre = '$objRecibido->nombre'&& estado = 1");

		if ($usuario != false && $usuario != null) {
			// Guarda el registro del login
			// $crud->insert("registro_logins", "id_usuario, dispositivo_usuario", "'$usuario->id', '$objRecibido->dispositivo'");
			// Trae la descripción del rol
			$rolDescripcion = $crud->select("descripcion", "roles", "id = '$usuario->id_rol'");

			// TOKEN
			$key = 'miToken';
			$token = array(
				"id" => $usuario->id,
				"nombre" => $usuario->nombre,
				"email" => $usuario->email,
				"password" => $usuario->password,
				"rol" => $rolDescripcion->descripcion,
				"foto" => $usuario->foto,
				"exp" => time() + 900
				// "iat" => 1356999524,
				// "nbf" => 1357000000
			);
			$jwt = Firebase\JWT\JWT::encode($token, $key, 'HS256');

			$array['miToken'] = $jwt;
			echo json_encode($array);
				
		}
		else {
			echo "401";
		}
		break;

	case 'recuperaPassword':
		
		$usuario = $crud->select("*", "usuarios", "email = '$objRecibido->email' && estado = 1");

		if ($usuario != null && $usuario != false) {					
			// ENVIO MAIL
			
			// Varios destinatarios
			$para  = $usuario->email; //. ', '; // atención a la coma
			// $para .= 'wez@example.com';
			
			// título
			$titulo = 'SISTEMA DE TORRELLAS: RECUPERACION PASSWORD';

			// mensaje
			$mensaje = '

			*****************
			*   TORRELLAS   *
			*****************
			
			SERVICIO DE RECUPERACION DE PASSWORD  

			**
			*   Datos de usuario:
			*
			*	E-mail:    '.$usuario->email.'
			*	Password:  '.$usuario->password.'
			**
			      
			Gracias por utilizar el sistema.
			Ante cualquier problema, duda o sugerencia no dudes en consultarnos.
			e-mail: jp.torrellas@gmx.com
			
			';

			mail($para, $titulo, $mensaje);

			$respuesta['mensaje'] = 'ok';
			echo json_encode($respuesta);
		}
		else {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		break;

	case 'alta':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d_H-i-s");
	

		$usuario = $crud->select("*", "usuarios", "email = '$objRecibido->email'");
		// Si existe un usuario con ese mail devuelve un error
		if ($usuario != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {
			
			// trae descricion de rol
			$idRol = $crud->select("id", "roles", "descripcion = '$objRecibido->rol'");

			if($crud->insert("usuarios", "nombre, email, password, id_rol, fecha_alta", "'$objRecibido->nombre', '$objRecibido->email', '$objRecibido->password1', '$idRol->id', '$fechaActual'")) {

				$usuarioCreado = $crud->select("id", "usuarios", "email = '$objRecibido->email'");

				if (isset($objRecibido->foto) && $objRecibido->foto != null && $objRecibido->foto != '') {
					
					// Obtiene extension del archivo a subir
					//$extension = explode("/", $objRecibido->foto[0]->filetype);
					//$extension = $extension[1];
					//$Base64Img = base64_decode($objRecibido->foto[0]->base64);
					
					$array = explode(',', $objRecibido->foto);
					$objRecibido->foto = $array[1];
					
					$extension = 'png';
					$Base64Img = base64_decode($objRecibido->foto);
					
					$nombreFoto = $usuarioCreado->id.'-'.$fechaActual.'.'.$extension;
					$archivoImagen = '../img/usuarios/'.$nombreFoto;
					
					file_put_contents($archivoImagen, $Base64Img);

					// inserta nombre de foto subida
					$crud->update("usuarios", "foto = '$nombreFoto'", "id = '$usuarioCreado->id'");
				}

				$respuesta['mensaje'] = 'ok';
				echo json_encode($respuesta);
			}
			else {
				
				$respuesta['mensaje'] = 'error';
				echo json_encode($respuesta);
				
			}
		}
		break;

	case 'baja':
    	
    	$usuario = $crud->select("*", "usuarios", "id = '$objRecibido->idUsuario' && estado = 1");

		if ($usuario != false && $usuario != null) {

	    	if ($crud->update("usuarios", "estado = 0", "id = '$objRecibido->idUsuario'")) {
	    		$respuesta['mensaje'] = 'ok';
				echo json_encode($respuesta);
	    	}
	    	else {
	    		$respuesta['mensaje'] = 'error';
				echo json_encode($respuesta);
	    	}
	    }
	    else {
	    	$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
	    }

    	break;

	case 'modificacion':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d_H-i-s");
	

		$usuario = $crud->select("*", "usuarios", "id = '$objRecibido->id' && estado = 0");
		// Si no existe el usuario o esta en estado 0
		if ($usuario != null) {
			$respuesta['mensaje'] = 'error. no existe el usuario';
			echo json_encode($respuesta);
		}
		else {
			
			// trae id de rol
			$idRol = $crud->select("id", "roles", "descripcion = '$objRecibido->rol'");

			// Si no actualizó la foto
			if ($objRecibido->foto == '') {
				// Actualiza solo datos
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', email = '$objRecibido->email', password = '$objRecibido->password1', id_rol = '$idRol->id'", "id = '$objRecibido->id'");

				// Trae datos actualizados
				$usuarioActualizado = $crud->select("*", "usuarios", "id = '$objRecibido->id'");
				// trae descricion de rol
				$descripcionRol = $crud->select("descripcion", "roles", "id = '$usuarioActualizado->id_rol'");
				$usuarioActualizado->rol = $descripcionRol->descripcion;

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $usuarioActualizado;
				echo json_encode($respuesta);
			}
			// Si actualizó la foto
			else {

				// Guarda la foto
				$array = explode(',', $objRecibido->foto);
				$objRecibido->foto = $array[1];
				
				$extension = 'png';
				$Base64Img = base64_decode($objRecibido->foto);
				
				$nombreFoto = $objRecibido->id.'-'.$fechaActual.'.'.$extension;
				$archivoImagen = '../img/usuarios/'.$nombreFoto;
				
				file_put_contents($archivoImagen, $Base64Img);

				// Actualiza datos y foto
				$crud->update("usuarios", "nombre = '$objRecibido->nombre', email = '$objRecibido->email', password = '$objRecibido->password1', foto = '$nombreFoto', id_rol = '$idRol->id'", "id = '$objRecibido->id'");

				// Trae datos actualizados
				$usuarioActualizado = $crud->select("*", "usuarios", "id = '$objRecibido->id'");
				// trae descricion de rol
				$descripcionRol = $crud->select("descripcion", "roles", "id = '$usuarioActualizado->id_rol'");
				$usuarioActualizado->rol = $descripcionRol->descripcion;

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $usuarioActualizado;
				echo json_encode($respuesta);
			}
		}
		break;	

	case 'listado':
		
		// $tabla1 = 'usuarios';
		// $tabla2 = 'roles';
		// $campos = 'usuarios.id, usuarios.nombre, usuarios.email, usuarios.password, usuarios.foto, roles.descripcion as rol';
		// $condicion = "usuarios.id_rol = roles.id WHERE usuarios.estado = 1";

		// $listaElementos = $crud->selectJoin("$campos", "$tabla1", "$tabla2", "$condicion");
  //   	if ($listaElementos != null && $listaElementos != false) {

  //   		$respuesta['mensaje'] = 'ok';
		// 	$respuesta['datos'] = $listaElementos;
		// 	echo json_encode($respuesta);
  //   	}
  //   	else {
  //   		$respuesta['mensaje'] = 'error';
		// 	echo json_encode($respuesta);
  //   	}
		// break;
		
		$listaElementos = $crud->selectList("usuarios.*, roles.descripcion as rol", "usuarios, roles", "usuarios.id_rol = roles.id AND estado = 1");
    	
    	if ($listaElementos != null && $listaElementos != false) {

    		$respuesta['mensaje'] = 'ok';
			$respuesta['datos'] = $listaElementos;
			echo json_encode($respuesta);
    	}
    	else {
    		$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
    	}
		break;

	default:
		echo "error";
		break;
}


?>