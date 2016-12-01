<?php

/**
 * WebService PHP.
 * Incluye JWT para token descargado de:
 * https://github.com/firebase/php-jwt
 *
 * PHP version 5
 *
 * @category WebService
 * @version  1.0.2 - 09/11/2016  
 * @author   Juan Pablo Torrellas <jp.torrellas@gmx.com>
 * @link     https://github.com/jptorrellas
 */

/**
* Clase que contiene las funciones para el crud (ABM)
*/
class Crud extends DBConnection
{
	/**
	* Atributos
	*/
	private $arrayDeProteccion = ['insert', 'update', 'delete', 'drop', 'alter', 'altertable', 'create', 'grant', 'revoke', 'table', 'view', 'index'];

	function __construct(){}

	/**
	* Función: protectQuery
	* @param array $arrayRecibido 
	* @return true | false
	*/
	private function protectQuery ($arrayRecibido) 
	{
		foreach ($arrayRecibido as $itemRecibido) {
			if ($itemRecibido != null) {
				foreach ($this->arrayDeProteccion as $itemDeProteccion) {
					if (stripos($itemRecibido, $itemDeProteccion)) {
						//echo $itemDeProteccion . " encontrado";
						return false;
					}
				}
			}
		}
		return true;
	}
	
	/**
	* Función: insert
	* @param string $tabla 
	* @param string $campos
	* @param string $valores
	* @return true | false
	*/
	public function insert($tabla, $campos, $valores)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$tabla, $campos, $valores])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// Preparación del query
			$sql = "INSERT INTO $tabla ($campos) VALUES ($valores)";
			
			$q = $conn->prepare($sql);

			// Ejecución del query
			try {
				$q->execute();

			// Cerrar conexión
			$conn = null;
			
			return true;

			} catch (Exception $e) {
				return false;
			}
		}
	}

	/**
	* Función: select
	* @param string $campos
	* @param string $tabla 
	* @param string $condiciones
	* @return object | false
	*/
	public function select($campos, $tabla, $condiciones=null)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$campos, $tabla, $condiciones])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// PREPARACION DEL QUERY
			$sql = "SELECT $campos FROM $tabla WHERE $condiciones";
			$q = $conn->prepare($sql);

			// EJECUCION DEL QUERY
			try {
				 $q->execute();

				// CIERRA CONEXION
				$conn = null;

				return  $q->fetchObject();

			} catch (Exception $e) {
				echo $e;
				return false;
			}
		}	
	}

	/**
	* Función: selectList
	* @param string $campos
	* @param string $tabla 
	* @param string $condiciones
	* @return object | null | false
	*/
	public function selectList($campos, $tabla, $condiciones=null)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$campos, $tabla, $condiciones])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// PREPARACION DEL QUERY
			$sql = "SELECT $campos FROM $tabla WHERE $condiciones";
			$q = $conn->prepare($sql);

			// EJECUCION DEL QUERY
			try {
				 $q->execute();

				// CIERRA CONEXION
				$conn = null;

				return  $q->fetchAll();

			} catch (Exception $e) {
				return false;
			}
		}
	}

	/**
	* Función: selectJoin
	* @param string $campos
	* @param string $tabla1
	* @param string $tabla2
	* @param string $condiciones
	* @return object | null | false
	*/
	public function selectJoin($campos, $tabla1, $tabla2, $condiciones)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$campos, $tabla1, $tabla2, $condiciones])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// PREPARACION DEL QUERY
			$sql = "SELECT $campos FROM $tabla1 JOIN $tabla2 ON $condiciones";
			$q = $conn->prepare($sql);

			// EJECUCION DEL QUERY
			try {
				 $q->execute();

				// CIERRA CONEXION
				$conn = null;

				return  $q->fetchAll();

			} catch (Exception $e) {
				return false;
			}
		}
	}

	/**
	* Función: update
	* @param string $tabla 
	* @param string $camposYvalores
	* @param string $condiciones
	* @return true | false
	*/
	public function update($tabla, $camposYvalores, $condiciones)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$tabla, $camposYvalores, $condiciones])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// Preparación del query
			$sql = "UPDATE $tabla SET $camposYvalores WHERE $condiciones";
			$q = $conn->prepare($sql);

			// Ejecución del query
			try {
				$q->execute();

				// Cerrar conexión
				$conn = null;
				
				return true;

			} catch (Exception $e) {
				return false;
			}
		}
	}

	/**
	* Función: delete
	* @param string $tabla 
	* @param string $condiciones
	* @return true | false
	*/
	public function delete($tabla, $condiciones)
	{
		// Protege de SQL injection
		if ($this->protectQuery([$tabla, $condiciones])) {
			// Conexión a BD
			$conn = parent::connectBD();

			// Preparación del query
			$sql = "DELETE FROM $tabla WHERE $condiciones";
			$q = $conn->prepare($sql);

			// Ejecución del query
			try {
				 $q->execute();
				
				// Cerrar conexión
				$conn = null;

				return true;

			} catch (Exception $e) {
				return false;
			}
		}
	}
}

?>