"use strict";

angular.module('app')

    .controller('AdminController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'productsService',
        'userService',

        function ($scope, $location, loaderService, apiService, productsService, userService) {

            $scope.model = productsService.model;


            $scope.orders = [];

            function showLoader() {
                loaderService.showLoader();
            }
            $scope.showLoader = showLoader;

            productsService.ready().then(function(){
                productsService.getOrders().then(function(res){
                    $scope.orders = res.orders;
                });
            })

            //productsService.clear();

            /*productsService.getProductTypes().then(function(data){
                $scope.categories = data.productTypes;
            });*/


            // TODO:
            /*$scope.updateProducts = function(){
                productsService.getProducts();
            }

            $scope.updateProducts();*/

        }
    ]
);

