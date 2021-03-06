angular.module('miSitio')
  
  .directive('grillaDeUsuarios', function() {

    return {
      scope:{
        directivaGrillaDatos: '=directivaGrillaDatos',
        rol: '@rol',
        id: '@id',
        urlimg: '@urlimg'     
      },
      replace: true,
      restrict: "E",
      templateUrl: "templates/directivas/dirGrillaDeUsuarios.html",
      controller: "GrillaUsuariosCtrl"
    };

  });