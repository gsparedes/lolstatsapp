angular.module('SummonerService', []).factory('Summoners', ['$http', function($http) {

    return {
        getLadderRankings : function() {
            return $http.get('/api/summonerLadderRankings');
        }
    }       

}]);