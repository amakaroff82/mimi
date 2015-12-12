"use strict";

angular.module('app')

    .controller('RegisterController', [

        '$scope',
        '$location',
        'loaderService',
        'userService',

        function ($scope, $location, loaderService, userService) {

            if(userService.currentUser.isAutorized){
                $location.path("")
            }

            $scope.name = "";
            $scope.email = "";
            $scope.password = "";

            $scope.register = function($event) {
                userService.register(
                    $scope.name,
                    $scope.email,
                    $scope.password
                ).
                then(function(response){
                    if(!response.error) {
                        userService.login(
                            $scope.email,
                            $scope.password
                        ).then(function(response){
                            if(!response.error) {
                                $location.path('');
                            }
                        })
                    }
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

