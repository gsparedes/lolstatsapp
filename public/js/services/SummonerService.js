angular.module('SummonerService', []).factory('Summoners', ['$http', function($http) {

    return {
        getLadderRankings : function() {
            return $http.get('/api/summonerLadderRankings');
        },
        getById : function(id) {
        	return $http.get('/api/summonerById/' + id);
        },
        getChampions : function(id) {
            return $http.get('/api/summonerChampions/' + id);
        }
    }

}]);