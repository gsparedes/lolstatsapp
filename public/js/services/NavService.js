angular.module('NavService', []).factory('Nav', ['$http', function($http) {

    return {
        searchByName : function(summonerData) {
        	return $http.post('/api/summonerSearch', summonerData);
        }
    }

}]);