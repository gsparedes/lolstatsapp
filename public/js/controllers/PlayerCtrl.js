angular.module('PlayerCtrl', []).controller('PlayerController', function($scope, $rootScope, $location, $route, Players) {
    $scope.formData = {};
    $scope.players = [];
    $scope.displayedPlayers = [].concat($scope.players);
    $scope.player = null;

	Players.getLadderRankings()
		.success(function(data) {
			$scope.players = data;
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