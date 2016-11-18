angular.module('miSitio')

.controller('AppCtrl', function($scope, $timeout, $state, $auth, growl, usuarioFactory, URLServidor, URLimgUsuarioPerfil) {

  // Para cargar la imagen del usuario en el menu-Perfil
  $scope.usuario = usuarioFactory.payload;
  $scope.usuario.URLimgUsuarioPerfil = URLServidor + URLimgUsuarioPerfil + usuarioFactory.payload.foto;

  // Logout
  $scope.logout = function() { 
    // Desconectamos al usuario
    $auth.logout()
    .then(function() {
        // Mensaje de despedida
        growl.info("Hasta pronto " + $scope.usuario.nombre + "!", {ttl: 5000});
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
.controller('LoginCtrl', function($state, $scope, $auth, growl, usuarioService, usuarioFactory) {

  var respuesta = {};

  $scope.loginData = 
  {
    email: 'admin@sitio.com',
    nombre: 'Juan',
    password : '123',
    accion: 'login'
  };

  $scope.recuperarPasswordData =
  {
    email: '',
    accion: 'recuperaPassword'
  };

  // Login
  $scope.login = function() {        

    $auth.login($scope.loginData, { timeout: 10000 })
    .then(
      function(respuesta) {
        if ($auth.isAuthenticated()) {
          
          // Guarda datos de usuario en usuarioFactory.payload
          var payload = $auth.getPayload();
          // Guarda el password en el usuarioFactory
          usuarioFactory.password = $scope.loginData.password;
          usuarioFactory.payload = payload;

          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();

          // Mensaje de bienvenida
          growl.info("Bienvenido " + usuarioFactory.payload.nombre + "!", {ttl: 5000});

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
          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();
          growl.error("Credenciales incorrectas.", {ttl: 5000});
        }
      },
      function(error) {
        growl.error("Problema de conexión con el servidor", {ttl: 5000});
      })

      .catch(function(error){
          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();
          growl.error("Problema de conexión con el servidor", {ttl: 5000});
      }
    ); 
  };

  // Recupera Password
  $scope.recuperarPassword = function() {
    
    usuarioService.recuperaPassword($scope.recuperarPasswordData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {
          // Limpia el formulario
          $scope.recuperarPasswordData = {};
          $scope.frmRecuperarPassword.$setPristine();
          $scope.frmRecuperarPassword.$setUntouched();
          growl.success(respuesta.mensaje, {ttl: 3000});
        }
        else {
          // Limpia el formulario
          $scope.recuperarPasswordData = {};
          $scope.frmRecuperarPassword.$setPristine();
          $scope.frmRecuperarPassword.$setUntouched();
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );              
  };
})

.controller('AltaUsuarioCtrl', function($state, $scope, growl, usuarioService, usuarioFactory, URLServidor, URLServices) {

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

          if ($scope.rol == null) {
            growl.success("Se acaba de registrar en el sistema! Ya puede acceder con sus credenciales.", {ttl: 5000});
            $state.go('login');
          }
          if ($scope.rol == 'admin') {
            growl.success("Alta de usuario ok!", {ttl: 3000});
            $state.go('admin.adminGrillaUsuarios');
          }          
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );
  };
})

.controller('DirectivasCtrl', function($state, $scope, usuarioService, usuarioFactory, URLServidor, URLimgUsuarioPerfil) {
  
  $scope.borrarUsuario = function(usuario, index) {

    $scope.borrarUsuarioData = { idUsuario : usuario.id, accion : 'borrarUsuario' };

    usuarioService.borrarUsuario($scope.borrarUsuarioData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          growl.success(respuesta.mensaje, {ttl: 3000});
          $scope.directivaGrillaUsuariosDatos.lista.datos.splice(index, 1);
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };

  $scope.editarUsuario = function(usuario) {

    // $scope.borrarUsuarioData = { idUsuario : usuario.id, accion : 'editarUsuario' };

    // usuarioService.borrarUsuario($scope.borrarUsuarioData)
    // .then( 
    //   function(respuesta) { 
    //     if (respuesta.estado == true) {
    //       alert(respuesta.mensaje);
    //       $scope.directivaGrillaUsuariosDatos.lista.datos.splice(index, 1);
    //     }
    //     else {
    //       alert(respuesta.mensaje); 
    //     }
    //   }
    // );
    alert("usuario a editar: "+usuario.id);
  };

})


//ADMIN
.controller('AdminGrillaUsuariosCtrl', function($state, $scope, usuarioService, usuarioFactory, URLServidor, URLimgUsuarioPerfil) {

  // Parámetros que se usan en la directiva
  $scope.rol = usuarioFactory.payload.rol;
  $scope.urlimg = URLServidor + URLimgUsuarioPerfil;
  $scope.directivaGrillaUsuariosDatos = {};

  $scope.traerTodosLosUsuariosData = { accion: 'traerTodosLosUsuarios' };

  function traerTodosLosUsuarios() {
    usuarioService.traerTodosLosUsuarios($scope.traerTodosLosUsuariosData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.directivaGrillaUsuariosDatos.lista = {datos: respuesta.datos};
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  traerTodosLosUsuarios();
  // Fin Parámetros que se usan en la directiva

})





