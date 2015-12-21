"use strict";

angular.module('app')

    .controller('HomeController', [

        '$scope',
        '$location',
        'loaderService',
        'productsService',
        'apiService',

        function ($scope, $location, loaderService, productsService, apiService) {

            $scope.model = productsService.model;
            productsService.ready();

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;
        }
    ]
);
