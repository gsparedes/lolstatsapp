angular.module('SummonerCtrl', []).controller('SummonerController', function($scope, $rootScope, $location, $route, Summoners) {
    $scope.summoners = [];
    $scope.displayedSummoners = [].concat($scope.summoners);    
    $scope.summonerChampions = [];
    $scope.displayedSummonerChampions = [].concat($scope.summonerChampions);
    $scope.summoner = null;
    $scope.rankedSeason = '';

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
                if (tab === 'ranked') {
                    Summoners.getChampions(summonerId, 'SEASON2016')
                        .then(function(response) {
                            if (response.status === 200 && response.data) {
                                $scope.summonerChampions = response.data;
                                $scope.rankedSeason = 'Season 6';
                            }
                        });
                }
            });        
    }

    $scope.isTabActive = function (tab) {
        var active = (tab === $location.search().tab);
        return active;
    };

    $scope.refreshSeasonData = function(season) {
        Summoners.getChampions($scope.summoner.id, season)
            .then(function(response) {
                if (response.status === 200 && response.data) {
                    $scope.summonerChampions = response.data;
                    switch(season) {
                        case 'SEASON2016':
                            $scope.rankedSeason = 'Season 6';
                            break;
                        case 'SEASON2015':
                            $scope.rankedSeason = 'Season 5';
                            break;
                        case 'SEASON2014':
                            $scope.rankedSeason = 'Season 4';
                            break;
                        default:
                            $scope.rankedSeason = 'Season 6';
                    }                    
                }                    
            });
    }
});