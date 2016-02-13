angular.module('SummonerService', []).factory('Summoners', ['$http', function($http) {

    return {
        getLadderRankings : function() {
            return $http.get('/api/summonerLadderRankings');
        },
        searchByName : function(summonerData) {
        	return $http.post('/api/summonerSearch', summonerData);
        }
    }       

}]);