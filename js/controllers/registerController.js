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

            $scope.error = "";

            $scope.name = "";
            $scope.email = "";
            $scope.password = "";
            $scope.conf_password = "";

            $scope.register = function($event) {
                $scope.error = "";

                if($scope.name != "") {
                    $scope.error = "Имя обязательное поле";
                    return;
                }

                if($scope.email != "") {
                    $scope.error = "Email обязательное поле";
                    return;
                }

                if($scope.password != "") {
                    $scope.error = "Пароль обязательное поле";
                    return;
                }

                if($scope.conf_password != "") {
                    $scope.error = "Подтверждение пароля обязательное поле";
                    return;
                }

                if($scope.conf_password != $scope.password) {
                    $scope.error = "Пароли не совпадают";
                    return;
                }

                userService.register(
                    $scope.name,
                    $scope.email,
                    $scope.password
                ).
                then(function(response){
                    $scope.error = "";
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

