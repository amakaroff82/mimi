"use strict";

angular.module('app')

    .controller('ProductController', [

        '$scope',
        '$location',
        '$timeout',
        'loaderService',
        'apiService',
        'userService',
        '$routeParams',
        'Upload',

        function ($scope, $location, $timeout, loaderService, apiService, userService, $routeParams, Upload) {
            $scope.model = {};

            apiService.getProducts().then(function(data){
                for(var i = 0; i < data.products.length; i++){
                    var product = data.products[i];
                    if($routeParams.id == product.id){
                        $scope.model.product = product;

                        return;
                    }
                }
            });

            $scope.updateImages = function(){
                apiService.getProductImages($routeParams.id).then(function(data){
                    $scope.model.images = data.productImages;
                })
            }

            $scope.updateImages();


            $scope.uploadFiles = function (files) {
                $scope.files = files;
                if (files && files.length) {
                    Upload.upload({
                        url: 'v1/upload/' + $scope.model.product.id,
                        data: {
                            files: files
                        },
                        headers:{
                            "authorization": userService.currentUser.apiKey
                        }
                    }).then(function (response) {
                        $timeout(function () {
                            $scope.result = response.data;
                        });
                    }, function (response) {
                        if (response.status > 0) {
                            $scope.errorMsg = response.status + ': ' + response.data;
                        }
                    }, function (evt) {
                        $scope.progress =
                            Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            };

            $scope.selectImage = function(path){
                $scope.model.product.path = path;
            }

            $scope.setDefaultImage = function(image_id){
                apiService.setDefaultImage(
                    $scope.model.product.id,
                    image_id,
                    userService.currentUser.apiKey
                ).then(function(data){
                        //$scope.selectImage()
                    /*$timeout(function(){
                        $scope.updateImages();
                    }, 500)*/
                });
            }


            $scope.showLoader = function() {
                loaderService.showLoader();
            }

        }
    ]
);
