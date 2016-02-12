angular.module('PlayerService', []).factory('Players', ['$http', function($http) {

    return {
        getLadderRankings : function() {
            return $http.get('/api/playerLadderRankings');
        }
    }       

}]);