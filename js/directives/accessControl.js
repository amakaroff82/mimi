"use strict";

angular.module("app")
    .directive("accessControl", function(){
        return {
            restrict: 'EAC',
            templateUrl: "js/directives/accessControl.html",
            scope: {
                product: '='
            },
            link: function (scope, element) {
                //scope.images = scope.product.imgs.split("|");

                /*scope*/
            }
        }

    })

