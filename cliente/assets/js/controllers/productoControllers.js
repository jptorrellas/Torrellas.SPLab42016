angular.module('miSitio')


.controller('GrillaProductosCtrl', function($scope, $state, growl, usuarioFactory, productoService, urlFactory) {

  // Parámetros que se usan en la directiva
  $scope.rol = usuarioFactory.payload.rol;
  $scope.urlimg = urlFactory.imgProducto;
  $scope.directivaGrillaDatos = {};
  $scope.grillaTitulo = 'Lista de Productos';
  // Fin Parámetros que se usan en la directiva

  $scope.traerTodo = function() {
    $scope.traerTodoData = { accion: 'listado' };
    
    productoService.listado($scope.traerTodoData)
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

    $scope.borrarData = { idProducto : item.id, accion : 'baja' };

    if (confirm('Esta seguro que desea borrar el producto '+item.id+'?')) {
      productoService.baja($scope.borrarData)
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

    $scope.frmTitulo = 'Editar Producto';
    $scope.btnModificarFoto = 'Modificar foto';   
    
    $scope.frmData =
    {
      id: item.id,
      descripcion: item.descripcion,
      foto: urlFactory.imgProducto +  item.foto,
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
      
      productoService.modificacion($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Edición de producto ok!", {ttl: 3000});
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

    $scope.frmTitulo = 'Agregar Producto';
    $scope.btnModificarFoto = 'Modificar foto';

    $scope.frmData =
    {
      descripcion: 'producto1',
      foto: urlFactory.imgProducto + 'defaultProducto.jpeg',
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
    
      productoService.alta($scope.frmData)
      .then( 
        function(respuesta) {          
          if (respuesta.estado == true) {
            growl.success("Nuevo producto agregado ok!", {ttl: 3000});
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









