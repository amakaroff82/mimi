"use strict";

angular.module('app')

    .controller('CartController', [

        '$scope',
        '$location',
        'loaderService',
        'productsService',
        'apiService',

        function ($scope, $location, loaderService, productsService, apiService) {

            $scope.cartList = [];
            $scope.model = productsService.model;

            productsService.ready().then(function() {

                $scope.$watch("$scope.model.cart", function(newVal, oldVal){

                    $scope.summ = 0;
                    $scope.cartList = _.map($scope.model.cart, function(cartProduct){

                        var product = productsService.getProductById(cartProduct.id);

                        var newP = {
                            id: product.id,
                            count: product.count,
                            title: product.title,
                            price: product.price
                        }

                        return newP;
                    });
                });
            });

            $scope.setProductCartCount = function(product_id, count){
                productsService.setProductCartCount(product_id, count);
            }

            $scope.setProductCartCountIncrement = function(product_id, increment){
                productsService.setProductCartCountIncrement(product_id, increment);
            }

/*            $scope.summ = function(){

                _summ += (product.count * product.price);
            }
  */


            $scope.getProductById = function(id) {
                productsService.getProductById(id)
            }

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;
        }
    ]
);
