"use strict";

angular.module('app')

    .controller('ProductsController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'userService',
        '$routeParams',

        function ($scope, $location, loaderService, apiService, userService, $routeParams) {

            $scope.typeId = $routeParams.catId

            var key = userService.currentUser.apiKey;

            apiService.getProducts().then(function(data){
                $scope.products = data.products;
            })

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

        }
    ]
);
