var lolStatsApp = angular.module('lolStatsApp',
	[
		'ngRoute',
		'appRoutes',
		'smart-table',
		'SummonerCtrl',
		'SummonerService',
		'NavCtrl',
		'NavService'
	]
)

lolStatsApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    	if (current.$$route)
        	$rootScope.title = current.$$route.title;
    });
}]);