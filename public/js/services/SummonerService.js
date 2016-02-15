angular.module('SummonerService', []).factory('Summoners', ['$http', function($http) {

    return {
        getLadderRankings : function() {
            return $http.get('/api/summonerLadderRankings');
        },
        getById : function(id) {
        	return $http.get('/api/summonerById/' + id);
        },
        getChampions : function(id, season) {
            return $http.get('/api/summonerChampions/' + id + '/' + season);
        },
        getRecentGames : function(id) {
            return $http.get('/api/summonerRecentGames/' + id);
        }
    }

}]);