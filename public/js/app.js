var apiApp = angular.module('lolStatsApp',
	[
		'ngRoute',
		'appRoutes',
		'smart-table',
		'PlayerCtrl',
		'PlayerService'
	]
)

apiApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);