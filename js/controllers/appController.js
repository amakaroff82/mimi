"use strict";

angular.module('app')

    .controller('AppController', [

        '$rootScope',
        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'userService',

        function ($rootScope, $scope, $location, loaderService, apiService, userService) {

            $scope.user = userService.currentUser;
            userService.tryAutoLogin();

            apiService.getProductTypes().then(function(data){
                $scope.categories = data.productTypes;
            })

            $scope.logout = function($event){
                userService.logout();
                $event.preventDefault();
            }

            $scope.showLoader = function() {
                loaderService.showLoader();
            }






            /*$scope.quickUserLogin = function () {

                loaderService.showLoader();

                apiService.login({
                    name: 'TEST_USER',
                    password: 'TEST_USER'
                }, {
                    success: function (response) {
                        $location.path('/lectures-list');
                    },
                    failure: function (error) {
                        alert(error.message);
                        loaderService.hideLoader();
                    }
                });
            }*/
        }
    ]
);
