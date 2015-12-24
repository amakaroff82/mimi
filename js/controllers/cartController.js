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
                    $scope.cartList = [];

                    for(var i = 0; i < $scope.model.cart.length; i++){
                        var product = productsService.getProductById($scope.model.cart[i].id);

                        if(product) {
                            var newP = {
                                id: product.id,
                                count: product.count,
                                title: product.title,
                                price: product.price
                            }
                            $scope.cartList.push(newP);
                        }
                        else{
                            $scope.model.cart.splice(i, 1);
                            i--;
                        }
                    }
                });
            });

            $scope.setProductCartCount = function(product_id, count){
                productsService.setProductCartCount(product_id, count);
            }

            $scope.setProductCartCountIncrement = function(product_id, increment){
                productsService.setProductCartCountIncrement(product_id, increment);
            }

            $scope.createOrder = function(id) {




                //productsService.getProductById(id)
            }

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
