"use strict";

angular.module('app')

    .controller('HomeController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',

        function ($scope, $location, loaderService, apiService) {

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

        }
    ]
);
