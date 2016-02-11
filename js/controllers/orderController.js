"use strict";

angular.module('app')
    .controller('OrderController', [
        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'productsService',
        'userService',
        '$routeParams',
        function ($scope, $location, loaderService, apiService, productsService, userService, $routeParams) {

            $scope.model = productsService.model;

            $scope.order = {};

            function showLoader() {
                loaderService.showLoader();
            }
            $scope.showLoader = showLoader;

            productsService.ready().then(function(){
                productsService.getOrder($routeParams.id).then(function(res){
                    $scope.order = res.order;

                    $scope.cartList = JSON.parse($scope.order.order);
                });
            });
        }
    ]
);

