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

// Incluye HEADERS
include_once('headers/headers.php');

// Incluye JWT (para token)
include_once('jwt/JWT.php');
include_once('jwt/ExpiredException.php');
include_once('jwt/BeforeValidException.php');
include_once('jwt/SignatureInvalidException.php');

// Incluye CONFIGURACION BD
include_once("../ws/bd/DBConnection.php");
	
// Incluye CRUD
include_once('crud/crud.php');

?>