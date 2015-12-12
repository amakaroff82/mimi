"use strict";

angular.module('app')

    .controller('AdminController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',

        function ($scope, $location, loaderService, apiService) {




            $scope.model = {};

            function showLoader() {
                loaderService.showLoader();
            }
            $scope.showLoader = showLoader;

            $scope.clear = function(){
                $scope.model.newProduct = {
                    title: "Игрушка",
                    type:1,
                    price: 0,
                    price_old: 0,
                    description:""
                }
            }

            $scope.clear();

            apiService.getProductTypes().then(function(data){
                $scope.categories = data.productTypes;
            })

            $scope.updateProducts = function(){
                apiService.getProducts().then(function(data){
                    $scope.products = data.products;
                })
            }

            $scope.updateProducts();

            $scope.addNewProduct = function(){

                apiService.newProduct($scope.model.newProduct).then(function(result){
                    $scope.clear();
                    $scope.updateProducts();
                })
            }
        }
    ]
);

