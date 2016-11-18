angular.module('miSitio')
  
  .directive('grillaDeUsuarios', function() {

    return {
      scope:{
        // usuario: '=usuario'
        directivaGrillaUsuariosDatos: '=directivagrillausuariosdatos',
        rol: '@rol'
      },
      replace: true,
      restrict: "E",
      templateUrl: "templates/directivas/dirGrillaDeUsuarios.html"
    }

  });