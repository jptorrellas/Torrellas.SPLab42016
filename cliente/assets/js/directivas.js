angular.module('miSitio')
  
  .directive('listaDeUsuarios', function() {

    return {
      scope:{
        usuario: '=usuario',
        URLimgPerfilUsuarioCompleta: '=url'
      },
      replace: true,
      restrict: "EA", 
      templateUrl: "templates/directivas/grillaDeUsuarios.html"
    }

  });