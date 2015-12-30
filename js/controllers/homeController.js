"use strict";

angular.module('app')

    .controller('HomeController', [

        '$scope',
        '$location',
        'loaderService',
        'productsService',
        'apiService',

        function ($scope, $location, loaderService, productsService, apiService) {

            $scope.slides = [
                "_DSC1827.jpg",
                "_DSC1829.jpg",
                "_DSC1830.jpg",
                "_DSC1832.jpg",
                "_DSC2060.jpg",
                "_DSC2062.jpg",
                "_DSC2195.jpg",
                "_DSC2197.jpg",
                "_DSC2289.jpg",
                "_DSC2538.jpg"
            ];

            $scope.model = productsService.model;
            productsService.ready();

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;
        }
    ]
);
