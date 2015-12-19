"use strict";

angular.module("app")
    .directive("accessControl", [
        "userService",
        "$rootScope",

        function(userService, $rootScope){
            return {
                restrict: 'EAC',
                templateUrl: "js/directives/accessControl.html",
                scope: {
                    product: '=',
                    ignoreDemoMode: '=ignoreDemoMode'
                },
                transclude: true,
                link: function (scope, element) {
                    scope.currentUser = userService.currentUser;

                    //scope.ignoreDemoMode;
                }
            }
        }
    ])

