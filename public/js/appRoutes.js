angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/ladderRankings', {
            title: 'Current Ladder Rankings',
            templateUrl: 'views/ladderRankings.html',
            controller: 'PlayerController'
        })

        .otherwise({ redirectTo: '/ladderRankings' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);