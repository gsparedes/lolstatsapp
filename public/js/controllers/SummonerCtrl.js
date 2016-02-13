angular.module('SummonerCtrl', []).controller('SummonerController', function($scope, $rootScope, $location, $route, Summoners) {
    $scope.summoners = [];
    $scope.displayedSummoners = [].concat($scope.summoners);    
    $scope.summonerChampions = [];
    $scope.displayedSummonerChampions = [].concat($scope.summonerChampions);
    $scope.summoner = null;

	Summoners.getLadderRankings()
		.success(function(data) {
			$scope.summoners = data;
		});

    if ($location.path() === '/detailSummoner') {
        var summonerId = $location.search().id;
        Summoners.getById(summonerId)
            .then(function(response) {
                if (response.status === 200 && response.data)
                    $scope.summoner = response.data;

                var tab = $location.search().tab;
                if (tab === 'champs') {
                    Summoners.getChampions(summonerId)
                        .then(function(response) {
                            if (response.status === 200 && response.data)
                                $scope.summonerChampions = response.data;
                        });
                }
            });        
    }

    $scope.isTabActive = function (tab) {
        var active = (tab === $location.search().tab);
        return active;
    };
});