"use strict";

angular.module('app')

    .controller('LoginController', [

        '$scope',
        '$location',
        'loaderService',
        'userService',

        function ($scope, $location, loaderService, userService) {

            if(userService.currentUser.isAutorized){
                $location.path("")
            }

            $scope.email = "";
            $scope.password = "";

            $scope.login = function($event) {
                userService.login(
                    $scope.email,
                    $scope.password
                ).
                then(function(res){
                    $location.path('');
                });
                $event.preventDefault();
            }


            $scope.lostPassword = function() {
                /*userService.lostPassword(
                    $scope.email
                )*/
            }



            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

        }
    ]
);

