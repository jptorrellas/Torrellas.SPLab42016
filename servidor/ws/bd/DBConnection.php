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

class DBConnection {
	// Configuración de conexión a BD
	private $servidorBD = "localhost";
	private $nombreBD = "tp2parlab4";
	private $usuarioBD = "root";
	private $claveBD = "";
	private $conn;

	/**
	* Función: connectBD
	* @return PDO object
	*/
	protected function connectBD()
    {
        try { 
            $conn = new PDO("mysql:host=$this->servidorBD; dbname=$this->nombreBD; charset=utf8", $this->usuarioBD, $this->claveBD, array(PDO::ATTR_EMULATE_PREPARES => false,PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
			$conn->exec("SET CHARACTER SET utf8");
			return $conn;
			// $conn = new PDO("mysql:host=$this->servidorBD; dbname=$this->nombreBD; charset=utf8", $this->usuarioBD, $this->claveBD)  or die ("Error conctando a la BD");
			// $conn->exec("SET CHARACTER SET utf8");
			// return $conn;
        } 
        catch (PDOException $e) { 
            echo "Error al conectar con BD: " . $e->getMessage(); 
            die();
        }
    }
}

?>