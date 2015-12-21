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

            function showLoader() {
                loaderService.showLoader();
            }
            $scope.showLoader = showLoader;

            productsService.ready();

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

