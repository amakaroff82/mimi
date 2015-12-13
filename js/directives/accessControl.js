"use strict";

angular.module("app")
    .directive("accessControl", ["userService", function(userService){
        return {
            restrict: 'EAC',
            templateUrl: "js/directives/accessControl.html",
            scope: {
                product: '='
            },
            transclude: true,
            link: function (scope, element) {
                scope.currentUser = userService.currentUser;
            }
        }
    }])

