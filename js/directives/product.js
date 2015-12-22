"use strict";

angular.module("app")
    .directive("product", ['productsService', function(productsService){
        return {
            restrict: 'A',
            templateUrl: "js/directives/product.html",
            scope: {
                path: '@',
                product: '='
            },
            link: function (scope, element) {

                scope.images = "images/" + ((scope.product.path != "") ? scope.product.path : "default/nophoto.jpg");

                scope.setProductCartCountIncrement = function(product_id, increment){
                    productsService.setProductCartCountIncrement(product_id, increment);
                }

            }
        }
    }])
