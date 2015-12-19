"use strict";

angular.module('app')

    .controller('GalleryController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'userService',
        '$routeParams',

        function ($scope, $location, loaderService, apiService, userService, $routeParams) {

            $scope.typeId = $routeParams.catId

            var key = userService.currentUser.apiKey;

            $scope.updateProducts = function(){
                apiService.getProducts().then(function(data){
                    $scope.products = data.products;
                })
            }

            $scope.updateProducts();

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

            $scope.addNewProduct = function(){

                var newProduct = {
                    title: "Новая игрушка",
                    type: 0,
                    price: 0.00,
                    price_old: 0.00,
                    sold: 0,
                    description: "",
                    count: 0
                }

                apiService.newProduct(newProduct, userService.currentUser.apiKey).then(function(result){
                    newProduct.id = result.result.id;
                    $scope.products.push(newProduct);
                    window.location = "#/product/" + newProduct.id;
                });
            }
        }
    ]
);
