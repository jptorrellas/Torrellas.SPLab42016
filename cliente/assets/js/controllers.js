angular.module('miSitio')

.controller('AppCtrl', function($scope, $timeout, $state, $auth, usuarioFactory, URLServidor) {

  // Para cargar la imagen del usuario en el menu-Perfil
  $scope.usuario = usuarioFactory.payload;

  // Logout
  $scope.logout = function() { 
    // Desconectamos al usuario
    $auth.logout()
    .then(function() {
        // Vacía usuarioFactory.payload
        usuarioFactory.payload = {};
        usuarioFactory.password = {};
        $scope.usuario = {};
        // Abre el login
        $state.go('login');
    });
  }
})

//TODOS
.controller('LoginCtrl', function($state, $scope, $auth, usuarioService, usuarioFactory) {

  var respuesta = {};

  $scope.loginData = 
  {
    email: '',
    nombre: '',
    password : ''
  };

  $scope.recuperaPasswordData =
  {
    email: '',
    accion: 'recuperaPassword'
  };

  // Login
  $scope.login = function() {

    $scope.loginData.accion = 'login';          

    $auth.login($scope.loginData, { timeout: 10000 })
    .then(
      function(respuesta) {
        if ($auth.isAuthenticated()) {
          
          // Guarda datos de usuario en usuarioFactory.payload
          var payload = $auth.getPayload();
          // Guarda el password en el usuarioFactory
          usuarioFactory.password = $scope.loginData.password;
          $scope.loginData = {};
          usuarioFactory.payload = payload;

          if (usuarioFactory.payload.rol == "admin") {
            $state.go('admin.adminGrillaUsuarios');
          }
          if (usuarioFactory.payload.rol == "comprador") {
            alert("login ok: comprador");
            // $state.go('comprador.clienteVendedor');
          }
          if (usuarioFactory.payload.rol == "vendedor") {
            alert("login ok: vendedor");
            // $state.go('vendedor.vendedorInicio');
          }
        }
        else {
          $scope.loginData = {};
          alert('usuario o contraseña incorrecto.');
        }
      },
      function(error) {
        alert('ERROR: Problema de conexion con el servidor.');
      })

      .catch(function(error){
          // Si ha habido errores llegamos a esta parte
          alert('ERROR: Problema de conexion con el servidor.'); 
          $scope.loginData = {};
      }
    ); 
  };

  // Recupera Password
  $scope.recuperaPassword = function() {
    
    usuarioService.recuperaPassword($scope.recuperaPasswordData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          alert(respuesta.mensaje);
        }
        else {
          alert(respuesta.mensaje); 
        }
      }
    );              
  };
})

.controller('RegistroCtrl', function($state, $scope, usuarioService, usuarioFactory) {
  
  $scope.altaUsuarioData =
  {
    nombre: 'Prueba',
    email: 'prueba@sitio.com',
    password1: '123',
    password2: '123',
    rol: '2',
    accion: 'altaUsuario'
  };

  $scope.altaUsuario = function() {
    usuarioService.altaUsuario($scope.altaUsuarioData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          alert("Te acabas de registrar en el sistema! Ya puedes acceder con tus credenciales.")
          $state.go('login');
        }
        else {
          alert(respuesta.mensaje); 
        }
      }
    );
  };
})


//ADMIN
.controller('AdminGrillaUsuariosCtrl', function($state, $scope, usuarioService, usuarioFactory, URLServidor) {

  $scope.rol = usuarioFactory.payload.rol;
  $scope.directivaGrillaUsuariosDatos = {};
  //$scope.gridOptions = {};

  $scope.traerTodosLosUsuariosData =
  {
    accion: 'traerTodosLosUsuarios'
  };

  $scope.traerTodosLosUsuarios = function() {

    usuarioService.traerTodosLosUsuarios($scope.traerTodosLosUsuariosData)
    .then( 
      function(respuesta) { 

        if (respuesta.estado == true) {
          $scope.directivaGrillaUsuariosDatos.lista = {datos: respuesta.datos};
        }
        else {
          alert(respuesta.mensaje); 
        }
      }
    );
  };
  $scope.traerTodosLosUsuarios();

})

.controller('AdminAltaUsuarioCtrl', function($state, $scope, FileUploader, usuarioService, usuarioFactory, URLServidor, URLServices) {

  $scope.rol = usuarioFactory.payload.rol;
  
  $scope.altaUsuarioData =
  {
    nombre: 'Prueba',
    email: 'prueba@sitio.com',
    password1: '123',
    password2: '123',
    rol: '2',
    accion: 'altaUsuario'
  };

  $scope.altaUsuario = function() {
    usuarioService.altaUsuario($scope.altaUsuarioData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          alert("Carga ok!")
          $state.go('admin.adminGrillaUsuarios');
        }
        else {
          alert(respuesta.mensaje); 
        }
      }
    );
    //console.log($scope.altaUsuarioData.foto[0].base64);
  };
  
  
  

})



