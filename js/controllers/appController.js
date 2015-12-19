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

            $rootScope.demoMode = false;

            $rootScope.removeProduct = function(id, evt){
                if(confirm('Вы уверены, что хотите удалить этот продукт?')) {
                    apiService.deleteProduct(
                        id,
                        userService.currentUser.apiKey
                    ).then(function(data){
                        //alert("Продукт удален");
                        location.reload()
                    });
                }
            }

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
        }
    ]
);
