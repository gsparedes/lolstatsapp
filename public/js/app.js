var lolStatsApp = angular.module('lolStatsApp',
	[
		'ngRoute',
		'appRoutes',
		'smart-table',
		'SummonerCtrl',
		'SummonerService'
	]
)

lolStatsApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    	if (current.$$route.title)
        	$rootScope.title = current.$$route.title;
    });
}]);