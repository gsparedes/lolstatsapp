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

    $scope.summonerSearch = function() {
        console.log($scope.formData)
        Summoners.searchByName($scope.formData)
            .then(function(response) {
                $scope.formData = {};
                if (response.status === 200 && response.data) {
                    $scope.summoner = response.data;
                    var url = '/detailSummoner?id=' + $scope.summoner.id;
                    $location.url(url);
                }
            }, function(response) {
                $scope.error = 'Summoner not found';
                $location.path('/ladderRankings');
            });
    }
});