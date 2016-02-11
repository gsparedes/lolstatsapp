angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/login', {
            controller: 'AuthController'
        })

        .when('/logout', {
            controller: 'AuthController'
        })

        /*.when('/detailLog', {
            title: 'Detail Log View',
            templateUrl: 'views/detailLog.html',
            controller: 'LogController'
        })*/

        .otherwise({ redirectTo: '/login' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);