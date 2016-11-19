angular.module('miSitio')
  
  .directive('grillaDeUsuarios', function() {

    return {
      scope:{
        directivaGrillaUsuariosDatos: '=directivagrillausuariosdatos',
        rol: '@rol',
        urlimg: '@urlimg'     
      },
      replace: true,
      restrict: "E",
      templateUrl: "templates/directivas/dirGrillaDeUsuarios.html",
      controller: "GrillaUsuariosCtrl"
    };

  });