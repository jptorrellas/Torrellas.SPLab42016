angular.module('miSitio')

.controller('AppCtrl', function($scope, $timeout, $state, $auth, usuarioFactory, URLServidor, URLimgPerfilUsuario) {

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
            $state.go('admin.adminInicio');
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
          alert('usuario o contraseña incorrecto.', 'middle', false, 2500);
        }
      },
      function(error) {
        alert('ERROR: Problema de conexion con el servidor.', 'middle', false, 2500);
      })

      .catch(function(error){
          // Si ha habido errores llegamos a esta parte
          alert('ERROR: Problema de conexion con el servidor.', 'middle', false, 2500); 
          $scope.loginData = {};
      }
    ); 
  };
})

.controller('RegistroCtrl', function($state, $scope, usuarioService, usuarioFactory) {
  $scope.registroData =
  {
    nombre: 'Prueba',
    email: 'prueba@sitio.com',
    password1: '123',
    password2: '123',
    rol: '2',
    accion: 'registro'
  };

  $scope.registro = function() {
    usuarioService.registro($scope.registroData) // Checkea que no exista el usuario, si no existe lo registra
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          alert(respuesta.mensaje, 'middle', false, 2500);
          $state.go('login');
        }
        else {
          alert(respuesta.mensaje, 'middle', false, 2500); 
        }
      }
    );
  };
})


//ADMIN
.controller('AdminInicioCtrl', function($state, $scope, usuarioService, usuarioFactory, URLServidor, URLimgPerfilUsuario) {

  $scope.listaDeUsuarios = [];

  $scope.traerTodosLosUsuariosData =
  {
    accion: 'traerTodosLosUsuarios'
  };

  $scope.traerTodosLosUsuarios = function() {

    usuarioService.traerTodosLosUsuarios($scope.traerTodosLosUsuariosData)
    .then( 
      function(respuesta) { 

        if (respuesta.estado == true) {
          $scope.listaDeUsuarios = respuesta.datos;
          //console.log($scope.listaDeUsuarios);
        }
        else {
          alert(respuesta.mensaje, 'middle', false, 2500); 
        }
      }
    );
  };
  $scope.traerTodosLosUsuarios();
});



