angular.module('NavCtrl', []).controller('NavController', function($scope, $rootScope, $location, $route, Nav) {
    $scope.formData = {};
    $rootScope.error = null;

    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
    };

    $scope.summonerSearch = function() {
        Nav.searchByName($scope.formData)
            .then(function(response) {
                $scope.formData = {};
                if (response.status === 200 && response.data) {
                    $scope.summoner = response.data;
                    var url = '/detailSummoner?id=' + $scope.summoner.id + '&tab=ranked';
                    $location.url(url);
                } else
                    $rootScope.error = 'Summoner not found';
            });
    };
});