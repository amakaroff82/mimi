"use strict";

angular.module('app')

    .controller('ProductsController', [

        '$scope',
        '$location',
        'loaderService',
        'productsService',
        'userService',
        '$routeParams',

        function ($scope, $location, loaderService, productsService, userService, $routeParams) {

            $scope.typeId = $routeParams.catId

            var key = userService.currentUser.apiKey;

            $scope.model = productsService.model;
            productsService.ready();

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;
        }
    ]
);
