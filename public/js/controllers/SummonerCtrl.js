angular.module('SummonerCtrl', []).controller('SummonerController', function($scope, $rootScope, $location, $route, Summoners) {
    $scope.formData = {};
    $scope.summoners = [];
    $scope.displayedSummoners = [].concat($scope.summoners);
    $scope.summoner = null;

	Summoners.getLadderRankings()
		.success(function(data) {
			$scope.summoners = data;
		}); 

    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
    };
});