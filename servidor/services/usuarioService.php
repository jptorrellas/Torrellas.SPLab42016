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

	default:
		echo "error";
		break;
}


?>