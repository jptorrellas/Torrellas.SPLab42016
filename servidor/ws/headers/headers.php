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

// HEADERS
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
//header('Access-Control-Allow-Headers: origin, X-Requested-With, Content-type, Accept');

?>