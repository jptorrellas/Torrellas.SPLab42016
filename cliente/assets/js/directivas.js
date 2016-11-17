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
      templateUrl: "templates/directivas/grillaDeUsuarios.html"
      
      // template: "<tr>"
      //             +"<td>{{usuario.id}}</td>"
      //             +"<td><img style='width:50px; border-radius:50%;' ng-src='{{usuario.foto}}'></td>"
      //             +"<td>{{usuario.nombre}}</td>"
      //             +"<td>{{usuario.email}}</td>"
      //             +"<td>{{usuario.rol}}</td>"
      //           +"</tr>"
    }

  });