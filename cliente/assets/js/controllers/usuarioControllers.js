angular.module('miSitio')

.controller('MenuCtrl', function($scope, $rootScope, $state, $auth, growl, usuarioService, usuarioFactory, urlFactory) {


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

  // Los $rootScope son para que actualice en tiempo real los cambios de Usuario.
  $rootScope.usuarioActual = usuarioFactory.payload;
  $rootScope.usuarioActual.nombre = usuarioFactory.payload.nombre;
  $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;

  $scope.frmEditarPerfilTitulo = 'Editar Perfil';
  
  $scope.iniciarEditarPerfilData = function() {
    $scope.editarPerfilData =
    {
      id: $rootScope.usuarioActual.id,
      nombre: $rootScope.usuarioActual.nombre,
      email: $rootScope.usuarioActual.email,
      password1: $rootScope.usuarioActual.password,
      password2: $rootScope.usuarioActual.password,
      rol: $rootScope.usuarioActual.rol,
      foto: $rootScope.urlImg,
      accion: 'modificacion'
    };
  };
  $scope.iniciarEditarPerfilData();

  $scope.btnModificarFotoPerfil = 'Modificar foto perfil';  
  $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  $scope.imagenPerfilAbierta = 0;
  
  $scope.modificarFotoPerfil = function(valor=null) {
    
    $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
  
    if ($scope.btnModificarFotoPerfil == 'Modificar foto perfil' && valor == null) {
      $scope.btnModificarFotoPerfil = 'Cancelar modificación foto perfil';
      $scope.cargaFotoPerfilShow = true;
      return;
    }
    if ($scope.btnModificarFotoPerfil == 'Cancelar modificación foto perfil' || valor == false) {
      $scope.btnModificarFotoPerfil = 'Modificar foto perfil';
      $scope.imagenPerfilAbierta = 0;
      $scope.imagenPerfilElegida = '';
      $scope.fotoPerfilAGuardar = $scope.editarPerfilData.foto;
      $scope.cargaFotoPerfilShow = false;
    }
    // si se cierra el popup recupera datos originales de perfil
    if (valor == false) {

      $scope.iniciarEditarPerfilData();
    }
  };

  $scope.guardarPerfilEditado = function() {    

    if ($scope.imagenPerfilAbierta == 0) {
      $scope.editarPerfilData.foto = '';
    }
    else {
      $scope.editarPerfilData.foto = $scope.fotoPerfilAGuardar;
    }
    
    usuarioService.modificacion($scope.editarPerfilData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {

          usuarioFactory.payload = respuesta.datos;
          $rootScope.usuarioActual = usuarioFactory.payload;
          $rootScope.urlImg = urlFactory.imgPerfilUsuario + usuarioFactory.payload.foto;
          growl.success("Edición de perfil ok!", {ttl: 3000});       
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
            $state.go('menu.adminGrillaUsuarios');
          }
          if (usuarioFactory.payload.rol == "comprador") {
            $state.go('menu.compradorGrillaProductos');
          }
          if (usuarioFactory.payload.rol == "vendedor") {
            $state.go('menu.vendedorGrillaProductos');
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

.controller('RegistroCtrl', function($scope, $state, growl, usuarioService, usuarioFactory) {

  $scope.rol = usuarioFactory.payload.rol;
  $scope.frmTitulo = 'Registro de Usuario';
  $scope.btnCargarFotoPerfil = 'Cargar foto perfil';
  
  $scope.altaUsuarioData =
  {
    nombre: 'Prueba',
    email: 'prueba@sitio.com',
    password1: '123',
    password2: '123',
    rol: 'comprador',
    foto: '',
    accion: 'alta'
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
    
    usuarioService.alta($scope.altaUsuarioData)
    .then( 
      function(respuesta) {          
        if (respuesta.estado == true) {

          if ($scope.rol == null) {
            growl.success("Se acaba de registrar en el sistema! Ya puede acceder con sus credenciales.", {ttl: 5000});
            $state.go('login');
          }
          // if ($scope.rol == 'admin') {
          //   growl.success("Alta de usuario ok!", {ttl: 3000});
          //   $state.go('menu.adminGrillaUsuarios');
          // }         
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
  $scope.id = usuarioFactory.payload.id;
  $scope.urlimg = urlFactory.imgPerfilUsuario;
  $scope.directivaGrillaDatos = {};
  $scope.grillaTitulo = 'Lista de Usuarios';
  // Fin Parámetros que se usan en la directiva

  $scope.traerTodo = function() {
    $scope.traerTodoData = { accion: 'listado' };
    
    usuarioService.listado($scope.traerTodoData)
    .then( 
      function(respuesta) { 
        if (respuesta.estado == true) {
          $scope.directivaGrillaDatos.lista = {datos: respuesta.datos};
        }
        else {
          growl.error(respuesta.mensaje, {ttl: 3000}); 
        }
      }
    );
  };
  $scope.traerTodo();
  
  
  $scope.borrarItem = function(item, index) {

    $scope.borrarData = { idUsuario : item.id, accion : 'baja' };

    if (confirm('Esta seguro que desea borrar el usuario '+item.id+'?')) {
      usuarioService.baja($scope.borrarData)
      .then( 
        function(respuesta) { 
          if (respuesta.estado == true) {
            growl.success(respuesta.mensaje, {ttl: 3000});
            $scope.directivaGrillaDatos.lista.datos.splice(index, 1);
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

  $scope.editarItem = function(item) {

    $scope.frmTitulo = 'Editar Usuario';
    $scope.btnModificarFoto = 'Modificar foto';  
    
    $scope.frmData =
    {
      id: item.id,
      nombre: item.nombre,
      email: item.email,
      password1: item.password,
      password2: item.password,
      rol: item.rol,
      foto: urlFactory.imgPerfilUsuario +  item.foto,
      accion: 'modificacion'
    };

    $scope.fotoAGuardar = $scope.frmData.foto;   

    $scope.guardarItemEditado = function() {     
    
      if ($scope.imagenAbierta == 0) {
        $scope.frmData.foto = '';
      }
      else {
        $scope.frmData.foto = $scope.fotoAGuardar;
      }
      
      usuarioService.modificacion($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Edición de usuario ok!", {ttl: 3000});
            $scope.traerTodo();
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
      $scope.cargaFotoShow = false;
    };
  };

  
  
  
  $scope.agregarItem = function() {

    $scope.frmTitulo = 'Agregar Usuario';
    $scope.btnModificarFoto = 'Modificar foto';

    $scope.frmData =
    {
      nombre: 'Prueba',
      email: 'prueba@sitio.com',
      password1: '123',
      password2: '123',
      rol: 'comprador',
      foto: urlFactory.imgPerfilUsuario + 'defaultPerfil.jpeg',
      accion: 'alta'
    };

    $scope.fotoAGuardar = $scope.frmData.foto;

    $scope.guardarItemAgregado = function() {
    
      if ($scope.imagenAbierta == 0) {
        $scope.frmData.foto = '';
      }
      else {
        $scope.frmData.foto = $scope.fotoAGuardar;
      }
    
      usuarioService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo usuario agregado ok!", {ttl: 3000});
            $scope.traerTodo();       
          }
          else {
            growl.error(respuesta.mensaje, {ttl: 3000});
          }
        }
      );
    };
  };

  $scope.modificarFoto = function(valor=null) {
    
    $scope.fotoAGuardar = $scope.frmData.foto;
  
    if ($scope.btnModificarFoto == 'Modificar foto' && valor == null) {
      $scope.btnModificarFoto = 'Cancelar modificación foto';
      $scope.cargaFotoShow = true;
      return;
    }
    if ($scope.btnModificarFoto == 'Cancelar modificación foto' || valor == false) {
      $scope.btnModificarFoto = 'Modificar foto';
      $scope.imagenAbierta = 0;
      $scope.imagenElegida = '';
      $scope.fotoAGuardar = $scope.frmData.foto;
      $scope.cargaFotoShow = false;
    }
  };

  // ngImageCrop
  $scope.imagenElegida='';
  $scope.imagenAbierta = 0;

  var handleFileSelect=function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.imagenElegida=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput2')).on('change',handleFileSelect);
  // fin ngImageCrop

});