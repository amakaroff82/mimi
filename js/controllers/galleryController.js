"use strict";

angular.module('app')

    .controller('GalleryController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'userService',
        'productsService',
        '$routeParams',

        function ($scope, $location, loaderService, apiService, userService, productsService, $routeParams) {

            $scope.typeId = $routeParams.catId;

            $scope.model = productsService.model;
            productsService.ready()

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

            $scope.addNewProduct = function(){
                productsService.newProduct().then(function(newProduct){
                    window.location = "#/product/" + newProduct.id;
                });
            }
        }
    ]
);
