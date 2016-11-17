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
.controller('AdminInicioCtrl', function($state, $scope, usuarioService, usuarioFactory, URLServidor, i18nService, uiGridConstants) {

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
          alert(respuesta.mensaje, 'middle', false, 2500); 
        }
      }
    );
  };
  $scope.traerTodosLosUsuarios();



  // // Objeto de configuracion de la grilla.
  // $scope.gridOptions = {
  //   // Configuracion para exportar datos.
  //   exporterCsvFilename: 'misdatos.csv',
  //   exporterCsvColumnSeparator: ';',
  //   exporterPdfDefaultStyle: {fontSize: 9},
  //   exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
  //   exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
  //   exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
  //   exporterPdfFooter: function ( currentPage, pageCount ) {
  //     return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
  //   },
  //   exporterPdfCustomFormatter: function ( docDefinition ) {
  //     docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
  //     docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
  //     return docDefinition;
  //   },
  //   exporterPdfOrientation: 'portrait',
  //   exporterPdfPageSize: 'LETTER',
  //   exporterPdfMaxGridWidth: 500,
  //   exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
  //   onRegisterApi: function(gridApi){
  //     $scope.gridApi = gridApi;
  //   }
  // };
  
  // $scope.gridOptions.enableGridMenu = true;
  // $scope.gridOptions.selectAll = true;
  // $scope.gridOptions.paginationPageSizes = [25, 50, 75];
  
  // // Configuracion de la paginacion
  // $scope.gridOptions.paginationPageSize = 5;
  // $scope.gridOptions.columnDefs = columnDefs();
  
  // // Activo la busqueda en todos los campos.
  // $scope.gridOptions.enableFiltering = true;
  
  // // Configuracion del idioma.
  // i18nService.setCurrentLang('es');


  // // Cargo los datos en la grilla.
  // // $scope.gridOptions.data = [{id:1,nombre:'juancito',email:'j@j.com',rol:'admin'},{id:2,nombre:'pepito',email:'p@p.com',rol:'cliente'},{id:2,nombre:'toto',email:'t@t.com',rol:'cendedor'}];
  // usuarioService.traerTodosLosUsuarios($scope.traerTodosLosUsuariosData)
  // .then( 
  //   function(respuesta) { 

  //     if (respuesta.estado == true) {
  //       $scope.gridOptions.data = respuesta.datos;
  //     }
  //     else {
  //       alert(respuesta.mensaje, 'middle', false, 2500); 
  //     }
  //   }
  // );

  // function columnDefs () {
  //   return [
  //     { 
  //       field: 'id', 
  //       name: '#', 
  //       width: 45
  //     },
      
  //     { 
  //       field: 'nombre', 
  //       name: 'Nombre',
  //       enableFiltering: true
  //     },
      
  //     { 
  //       field: 'email', 
  //       name: 'email',
  //       enableFiltering: true
  //     },
      
  //     { 
  //       field: 'email', 
  //       name: 'mail'
  //     },
      
  //     { field: 'rol', 
  //       name: 'rol',
  //       enableFiltering: true
  //     }
  //   ];
  // }

});



