angular.module('SummonerCtrl', []).controller('SummonerController', function($scope, $rootScope, $location, $route, Summoners) {
    $scope.formData = {};
    $scope.summoners = [];
    $scope.displayedSummoners = [].concat($scope.summoners);
    $scope.summoner = null;

	Summoners.getLadderRankings()
		.success(function(data) {
			$scope.summoners = data;
		}); 

    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
    };

    $scope.checkSort = function($event) {
        var element = angular.element($event.target);
        if (element.hasClass('st-sort-ascent') || element.hasClass('st-sort-descent')) {
            var img = angular.element(element.children()[0]);
            img.hide();
        } else if (!element.hasClass('st-sort-ascent') && !element.hasClass('st-sort-descent')) {
            var img = angular.element(element.children()[0]);
            img.show();
        }
    }
});