angular.module('AuthCtrl', []).controller('AuthController', function($scope, $location, $window, AuthService) {
    $scope.userInfo;

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            $scope.userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        }
    }
    init();

    $scope.authenticate = function() {
        AuthService.authenticate($scope.loginForm)
        	.then(function(response) {
                $scope.loginForm = {};                
                if (response.status === 200 && response.data.user) {
                    var url = $location.protocol() + '://' + $location.host();
                    if ($location.protocol() === 'http')
                        url = url + ':' + $location.port();
                    url += '/customers';
                    var name = response.data.user.firstName + ' ' + response.data.user.lastName;
                    $scope.userInfo = {
                        username: $scope.loginForm.username,
                        name: name
                    };
                    $window.sessionStorage["userInfo"] = JSON.stringify($scope.userInfo);
                    $window.location.href = url;
                }
        	}, function(response) {
                $scope.error = 'Username and password are incorrect';
                $location.path('/login');
            });
    };

    $scope.logout = function () {
        AuthService.logout()
            .then(function () {
                $scope.userInfo = null;
                $window.location.href = '/login';
            });
    };

    $scope.isActive = function (viewLocation) {
        var active = (viewLocation === $location.path());
        return active;
    };

    $scope.$back = function() { 
        window.history.back();
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