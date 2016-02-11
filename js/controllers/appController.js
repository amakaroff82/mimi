"use strict";

angular.module('app')

    .controller('AppController', [

        '$rootScope',
        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'productsService',
        'userService',

        function ($rootScope, $scope, $location, loaderService, apiService, productsService, userService) {

            $rootScope.demoMode = false;

            $rootScope.removeProduct = function(id, evt){
                if(confirm('Вы уверены, что хотите удалить этот продукт?')) {
                    productsService.deleteProduct(id).then(function(data){
                        //location.reload()
                    });
                }
            }

            $scope.model = productsService.model;
            productsService.getProductTypes();

            $scope.user = userService.currentUser;
            userService.tryAutoLogin().catch(function(){
                if($scope.user.isAutorized || $scope.user.isAdmin) {
                    userService.logout();
                }
            });

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
