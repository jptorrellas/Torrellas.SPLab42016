angular.module('miSitio')

.controller('MenuCtrl', function($scope, $state, $auth, growl, usuarioService, usuarioFactory, urlFactory) {


  // Logout
  $scope.logout = function() { 
    // Desconectamos al usuario
    $auth.logout()
    .then(function() {
        // Mensaje de despedida
        growl.info("Hasta pronto " + $scope.usuarioActual.nombre + "!", {ttl: 5000});
        // Vacía usuarioFactory.payload
        usuarioFactory.payload = {};
        $scope.usuarioActual = {};
        // Abre el login
        $state.go('login');
    });
  };


  $scope.usuarioActual = usuarioFactory.payload;
  $scope.urlImg = urlFactory.imgPerfilUsuario + $scope.usuarioActual.foto;

  $scope.frmEditarPerfilTitulo = 'Editar Perfil';
  
  $scope.editarPerfilData =
  {
    id: $scope.usuarioActual.id,
    nombre: $scope.usuarioActual.nombre,
    email: $scope.usuarioActual.email,
    password1: $scope.usuarioActual.password,
    password2: $scope.usuarioActual.password,
    rol: $scope.usuarioActual.rol,
    foto: $scope.urlImg,
    accion: 'guardarUsuarioEditado'
  };

  $scope.btnModificarFotoPerfil = 'Modificar foto perfil';
  
  $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  $scope.imagenPerfilAbierta = 0;

  console.log($scope.fotoPerfilAGuardar);


    
  $scope.modificarFotoPerfil = function() {
    

    $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  
    if ($scope.btnModificarFotoPerfil == 'Modificar foto perfil') {
      $scope.btnModificarFotoPerfil = 'Cancelar modificación foto perfil';
      $scope.cargaFotoPerfilShow = true;
      return;
    }
    if ($scope.btnModificarFotoPerfil == 'Cancelar modificación foto perfil') {
      $scope.btnModificarFotoPerfil = 'Modificar foto perfil';
      
      //$scope.imagenPerfilElegida = $scope.editarPerfilData.foto;
      $scope.imagenPerfilAbierta = 0;
      $scope.imagenPerfilElegida = '';
      $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
      $scope.cargaFotoPerfilShow = false;
    }
  };

  $scope.guardarPerfilEditado = function() {    


    if ($scope.imagenPerfilAbierta == 0) {
      $scope.editarPerfilData.foto = '';
    }
    else {
      $scope.editarPerfilData.foto = $scope.fotoPerfilAGuardar;
    }
    
    usuarioService.guardarUsuarioEditado($scope.editarPerfilData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {

          usuarioFactory.payload = respuesta.datos;
          growl.success("Edición de perfil ok!", {ttl: 3000}); 
          // if ($scope.usuarioActual.rol == 'admin') {
          //   $state.go('admin.adminGrillaUsuarios');
          // }       
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000});
        }
      }
    );
    $scope.cargaFotoPerfilShow = false;
  };

  

  // ngImageCrop
  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.imagenPerfilElegida=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput3')).on('change',handleFileSelect);
  // fin ngImageCrop

  $scope.imagenPerfilElegida = '';
  $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;

  


  
})

.controller('LoginCtrl', function($scope, $state, $auth, growl, usuarioService, usuarioFactory) {

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
          usuarioFactory.payload = payload;

          // Limpia el formulario
          $scope.loginData = {};
          $scope.frmLogin.$setPristine();
          $scope.frmLogin.$setUntouched();

          // Mensaje de bienvenida
          growl.info("Bienvenido " + usuarioFactory.payload.nombre + "!", {ttl: 2000});

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

.controller('AltaUsuarioCtrl', function($scope, $state, growl, usuarioService, usuarioFactory) {

  $scope.rol = usuarioFactory.payload.rol;
  $scope.frmTitulo = 'Alta de Usuario';
  $scope.btnCargarFotoPerfil = 'Cargar foto perfil';
  
  $scope.altaUsuarioData =
  {
    nombre: 'Prueba',
    email: 'prueba@sitio.com',
    password1: '123',
    password2: '123',
    rol: 'comprador',
    foto: '',
    accion: 'altaUsuario'
  };

  $scope.cargarFotoPerfil = function() {
    
    if ($scope.btnCargarFotoPerfil == 'Cargar foto perfil') {
      $scope.btnCargarFotoPerfil = 'Cancelar foto perfil';
      $scope.cargaFotoShow = true;
      return;
    }
    if ($scope.btnCargarFotoPerfil == 'Cancelar foto perfil') {
      $scope.btnCargarFotoPerfil = 'Cargar foto perfil';
      $scope.cargaFotoShow = false;
      $scope.altaUsuarioData.foto = '';
      $scope.myImage = '';
      $scope.imagenAbierta = 0;
    }
  };

  $scope.altaUsuario = function() {
    
    if ($scope.imagenAbierta == 0) {
      $scope.altaUsuarioData.foto = '';
    }
    
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

  // ngImageCrop
  $scope.myImage='';
  $scope.imagenAbierta = 0;
  //$scope.myCroppedImage='';

  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.myImage=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
  // fin ngImageCrop  
})

.controller('GrillaUsuariosCtrl', function($scope, $state, growl, usuarioService, usuarioFactory, urlFactory) {

  // Parámetros que se usan en la directiva
  $scope.rol = usuarioFactory.payload.rol;
  $scope.urlimg = urlFactory.imgPerfilUsuario;
  $scope.directivaGrillaUsuariosDatos = {};

  function traerTodosLosUsuarios() {
    $scope.traerTodosLosUsuariosData = { accion: 'traerTodosLosUsuarios' };
    
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
  
  $scope.borrarUsuario = function(usuario, index) {

    $scope.borrarUsuarioData = { idUsuario : usuario.id, accion : 'borrarUsuario' };

    if (confirm('Esta seguro que desea borrar el usuario '+usuario.id+'?')) {
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
    } else {
        // Do nothing!
    } 
  };

  $scope.editarUsuario = function(usuario) {

    $scope.rol = usuarioFactory.payload.rol;
    $scope.frmEditarUsuarioTitulo = 'Editar Usuario';
    $scope.btnModificarFotoUsuario = 'Modificar foto perfil';   
    
    $scope.editarUsuarioData =
    {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      password1: usuario.password,
      password2: usuario.password,
      rol: usuario.rol,
      foto: urlFactory.imgPerfilUsuario +  usuario.foto,
      accion: 'guardarUsuarioEditado'
    };

    $scope.fotoUsuarioAGuardar = $scope.editarUsuarioData.foto;

    $scope.modificarFotoUsuario = function() {
      $scope.fotoUsuarioAGuardar = $scope.editarUsuarioData.foto;
    
      if ($scope.btnModificarFotoUsuario == 'Modificar foto perfil') {
        $scope.btnModificarFotoUsuario = 'Cancelar modificación foto perfil';
        $scope.cargaFotoUsuarioShow = true;
        return;
      }
      if ($scope.btnModificarFotoUsuario == 'Cancelar modificación foto perfil') {
        $scope.btnModificarFotoUsuario = 'Modificar foto perfil';
        
        $scope.imagenUsuarioElegida = $scope.editarUsuarioData.foto;
        $scope.imagenUsuarioAbierta = 0;
        $scope.fotoUsuarioAGuardar = $scope.editarUsuarioData.foto;
        $scope.cargaFotoUsuarioShow = false;
      }
    };

    $scope.guardarUsuarioEditado = function() {     
      console.log("guardarUsuarioEditado: Antes rol: "+$scope.rol);

      
      if ($scope.imagenUsuarioAbierta == 0) {
        $scope.editarUsuarioData.foto = '';
      }
      else {
        $scope.editarUsuarioData.foto = $scope.fotoUsuarioAGuardar;
      }
      
      usuarioService.guardarUsuarioEditado($scope.editarUsuarioData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            console.log("guardarUsuarioEditado: Despues rol: "+$scope.rol);
            growl.success("Edición de usuario ok!", {ttl: 3000});
            traerTodosLosUsuarios();

          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
      $scope.cargaFotoUsuarioShow = false;
    };

    // ngImageCrop
    $scope.imagenUsuarioElegida='';
    $scope.imagenUsuarioAbierta = 0;

    var handleFileSelect=function(evt) {
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.imagenUsuarioElegida=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput2')).on('change',handleFileSelect);
    // fin ngImageCrop
  };
});









