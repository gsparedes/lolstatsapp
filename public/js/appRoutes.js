angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/ladderRankings', {
            title: 'Current Ladder Rankings',
            templateUrl: 'views/ladderRankings.html',
            controller: 'SummonerController'
        })

        .when('/detailSummoner', {
            title: 'Summoner Statistical View',
            templateUrl: 'views/detailSummoner.html',
            controller: 'SummonerController'
        })

        .otherwise({ redirectTo: '/ladderRankings' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);