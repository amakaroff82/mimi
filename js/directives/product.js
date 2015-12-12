"use strict";

angular.module("app")
    .directive("product", function(){
        return {
            restrict: 'A',
            templateUrl: "js/directives/product.html",
            scope: {
                path: '@',
                product: '='
            },
            link: function (scope, element) {

                scope.images = "images/" + ((scope.product.path != "") ? scope.product.path : "default/nophoto.jpg");
            }
        }

    })
