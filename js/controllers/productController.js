"use strict";

angular.module('app')

    .controller('ProductController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        '$routeParams',

        function ($scope, $location, loaderService, apiService, $routeParams) {

            apiService.getProducts().then(function(data){
                for(var i = 0; i < data.products.length; i++){
                    var product = data.products[i];
                    if($routeParams.id == product.id){

                        $scope.product = product;
                        $scope.images = "images/" + (($scope.product.path != "") ? $scope.product.path : "default/nophoto.jpg");
                        return;
                    }
                }
            })


            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

        }
    ]
);
