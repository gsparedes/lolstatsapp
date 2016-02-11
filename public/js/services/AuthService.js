angular.module('AuthService', []).factory('AuthService', ['$http', function($http) {

    return {
        authenticate : function(authData) {
            return $http.post('/authenticate', authData);
        },
        logout : function() {
            return $http.get('/logout');
        }
    }       

}]);