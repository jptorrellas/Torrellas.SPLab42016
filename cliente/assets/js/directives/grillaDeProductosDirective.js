angular.module('miSitio')
  
  .directive('grillaDeProductos', function() {

    return {
      scope:{
        directivaGrillaDatos: '=directivagrillausProductos',
        rol: '@rol',
        urlimg: '@urlimg'     
      },
      replace: true,
      restrict: "E",
      templateUrl: "templates/directivas/dirGrillaDeProductos.html",
      controller: "GrillaProductosCtrl"
    };

  });