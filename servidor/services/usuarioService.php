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
 * select($tabla, $campos, $condiciones)
 * update($tabla, $camposYvalores, $condiciones)
 * delete($tabla, $condiciones)
 * selectJoin($campos, $tabla1, $tabla2, $condiciones)
*/

switch ($objRecibido->accion) {

	case 'devolver':

		echo $jsonObjeto;

		break;
	
	case 'login':

		$usuario = $crud->select("usuarios", "*", "email = '$objRecibido->email' && password = '$objRecibido->password' && nombre = '$objRecibido->nombre'&& estado = 1");

		if ($usuario != false && $usuario != null) {
			// Guarda el registro del login
			// $crud->insert("registro_logins", "id_usuario, dispositivo_usuario", "'$usuario->id', '$objRecibido->dispositivo'");
			// Trae la descripción del rol
			$rolDescripción = $crud->select("roles", "descripcion", "id = '$usuario->id_rol'");
			//if ($rolDescripción->descripcion == "Técnico") {
				// $cliente = $crud->select("clientes", "*", "id_usuario = '$usuario->id'");
				// if ($cliente != false && $cliente != null) {
					// TOKEN
					$key = 'miToken';
					$token = array(
						"id" => $usuario->id,
						"nombre" => $usuario->nombre,
						"email" => $usuario->email,
						"rol" => $rolDescripción->descripcion,
						"foto" => $usuario->foto,
						"exp" => time() + 900
						// "iat" => 1356999524,
						// "nbf" => 1357000000
					);
					$jwt = Firebase\JWT\JWT::encode($token, $key, 'HS256');

					$array['miToken'] = $jwt;
					echo json_encode($array);
				// }
				// else {
				// 	echo "401";
				// }
			//}
		}
		else {
			echo "401";
		}
		break;

	case 'registro':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d H:i:s");

		$usuario = $crud->select("usuarios", "*", "email = '$objRecibido->email'");
		// Si existe un usuario con ese mail devuelve un error
		if ($usuario != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {
			if($crud->insert("usuarios", "nombre, email, password, id_rol, fecha_alta", "'$objRecibido->nombre', '$objRecibido->email', '$objRecibido->password1', '$objRecibido->rol', '$fechaActual'")) {

				$respuesta['mensaje'] = 'ok';
				echo json_encode($respuesta);
			}
			else {
				$respuesta['mensaje'] = 'error';
				echo json_encode($respuesta);
			}
		}
		break;

	case 'traerTodosLosUsuarios':
		
		$tabla1 = 'usuarios';
		$tabla2 = 'roles';
		$campos = 'usuarios.id, usuarios.nombre, usuarios.email, usuarios.password, usuarios.foto, roles.descripcion as rol';
		$condicion = 'usuarios.id_rol = roles.id';

		$listaElementos = $crud->selectJoin("$campos", "$tabla1", "$tabla2", "$condicion");
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