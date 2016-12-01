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


	case 'alta':
		
		ini_set('date.timezone','America/Buenos_Aires'); 
		$fechaActual = date("Y-m-d_H-i-s");
	

		$producto = $crud->select("*", "productos", "descripcion = '$objRecibido->descripcion'");
		
		if ($producto != null) {
			$respuesta['mensaje'] = 'error';
			echo json_encode($respuesta);
		}
		else {

			if($crud->insert("productos", "descripcion, fecha_alta", "'$objRecibido->descripcion', '$fechaActual'")) {

				$productoCreado = $crud->select("id", "productos", "descripcion = '$objRecibido->descripcion'");

				if (isset($objRecibido->foto) && $objRecibido->foto != null && $objRecibido->foto != '') {
					
					// Obtiene extension del archivo a subir
					//$extension = explode("/", $objRecibido->foto[0]->filetype);
					//$extension = $extension[1];
					//$Base64Img = base64_decode($objRecibido->foto[0]->base64);
					
					$array = explode(',', $objRecibido->foto);
					$objRecibido->foto = $array[1];
					
					$extension = 'png';
					$Base64Img = base64_decode($objRecibido->foto);
					
					$nombreFoto = $productoCreado->id.'-'.$fechaActual.'.'.$extension;
					$archivoImagen = '../img/productos/'.$nombreFoto;
					
					file_put_contents($archivoImagen, $Base64Img);

					// inserta nombre de foto subida
					$crud->update("productos", "foto = '$nombreFoto'", "id = '$productoCreado->id'");
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
    	
    	$producto = $crud->select("*", "productos", "id = '$objRecibido->idProducto' && estado = 1");

		if ($producto != false && $producto != null) {

	    	if ($crud->update("productos", "estado = 0", "id = '$objRecibido->idProducto'")) {
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
	

		$producto = $crud->select("*", "productos", "id = '$objRecibido->id' && estado = 0");
		// Si no existe el usuario o esta en estado 0
		if ($producto != null) {
			$respuesta['mensaje'] = 'error. no existe el producto';
			echo json_encode($respuesta);
		}
		else {

			// Si no actualizó la foto
			if ($objRecibido->foto == '') {
				// Actualiza solo datos
				$crud->update("productos", "descripcion = '$objRecibido->descripcion'", "id = '$objRecibido->id'");

				// Trae datos actualizados
				$productoActualizado = $crud->select("*", "productos", "id = '$objRecibido->id'");
				// trae descricion de rol

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $productoActualizado;
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
				$archivoImagen = '../img/productos/'.$nombreFoto;
				
				file_put_contents($archivoImagen, $Base64Img);

				// Actualiza datos y foto
				$crud->update("productos", "descripcion = '$objRecibido->descripcion', foto = '$nombreFoto'", "id = '$objRecibido->id'");

				// Trae datos actualizados
				$productoActualizado = $crud->select("*", "productos", "id = '$objRecibido->id'");

				$respuesta['mensaje'] = 'ok';
				$respuesta['datos'] = $productoActualizado;
				echo json_encode($respuesta);
			}
		}
		break;	

	case 'listado':
	

		$listaElementos = $crud->selectList("*", "productos", "estado = 1");
    	
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