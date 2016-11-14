# WebService PHP.
### Incluye JWT para token descargado de:
### https://github.com/firebase/php-jwt
###
### PHP version 5
###
### @category WebService
###
### @author   Juan Pablo Torrellas <jp.torrellas@gmx.com>
### @link     https://github.com/jptorrellas

## @version  1.0.1 - 18/07/2016
### Carpetas:

/includeAll.php

	/bd/
		ConfigureBD.php

/crud/
	crud.php

/headers/
	headers.php

/JWT/
	BeforeValidException.php
	ExpiredException.php
	JWT.php
	SignatureInvalidException.php


## @version  1.0.2 - 09/11/2016

Update:
- Modificada funcionalidad y nombre de archivo:
Archivos afectados:

/includeAll.php -> modificado nombre de ConfigureBD.php -> renombrado a "DBConnection.php" en el include.

/bd/
		ConfigureBD.php -> renombrado a "DBConnection.php".

/crud/
	crud.php -> modificada funcionalidad.

- Agregadado:
	- Agregada función para proteger las query's de ataques SQL injection.

