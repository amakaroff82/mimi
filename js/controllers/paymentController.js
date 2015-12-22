"use strict";

angular.module('app')

    .controller('PaymentController', [

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
