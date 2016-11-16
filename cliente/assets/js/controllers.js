angular.module('miSitio')

.controller('AppCtrl', function($scope, $timeout, $state, $auth, usuarioFactory, URLServidor, URLimgPerfilUsuario) {

  // Para cargar la imagen del usuario en el menu-Perfil
  $scope.usuario = usuarioFactory.payload;
  $scope.usuario.urlUserPerfilImg = URLServidor + URLimgPerfilUsuario + usuarioFactory.payload.foto;

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
        console.log(respuesta);
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

//ADMIN
.controller('AdminInicioCtrl', function($state, $scope, $auth, usuarioService, usuarioFactory) {
  console.log("entro al AdminInicioCtrl");
});



