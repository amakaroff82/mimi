"use strict";

angular.module('app')

    .controller('OrdersController', [

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
            });
        }
    ]
);

