"use strict";

angular.module('app')

    .controller('ProductController', [

        '$scope',
        '$location',
        '$timeout',
        'loaderService',
        'apiService',
        'userService',
        'productsService',
        '$routeParams',
        'Upload',

        function ($scope, $location, $timeout, loaderService, apiService, userService, productsService, $routeParams, Upload) {

            $scope.model = productsService.model;


            productsService.ready().then(function(){
                $scope.model.product = productsService.getProductById($routeParams.id);

                $scope.model.selectedType = _.find($scope.model.productTypes, function(type){
                    if($scope.model.product.type == type.id){
                        return true
                    }
                    return false;
                });
            })

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

                            $scope.updateImages();
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
                //$scope.model.product.path = path;
            }

            $scope.setDefaultImage = function(image_id){
                apiService.setDefaultImage(
                    $scope.model.product.id,
                    image_id,
                    userService.currentUser.apiKey
                ).then(function(data){

                    var im = _.find($scope.model.images, function(item){
                        return (item.id == image_id)
                    });

                    if(im) {
                        $scope.model.product.path = im.path;
                    }
                });
            }

            $scope.deleteImage = function(image_id){
                if(confirm('Вы уверены, что хотите удалить эту картинку?')) {
                    apiService.deleteImage(
                        image_id,
                        userService.currentUser.apiKey
                    ).then(function (data) {
                            $scope.updateImages();
                        });
                }
            }

            $scope.updateProduct = function(){
                if($scope.model.selectedType) {
                    $scope.model.product.type = $scope.model.selectedType.id;
                }
                apiService.updateProduct(
                    $scope.model.product,
                    userService.currentUser.apiKey
                ).then(function(data){
//                  $location.path('');
                });
            }

            $scope.deleteProduct = function(id){
                apiService.deleteProduct(
                    id,
                    userService.currentUser.apiKey
                ).then(function(data){
                    model.products = _.without(model.products, _.findWhere(model.products, {id: id}));

                });
            }

            $scope.showLoader = function() {
                loaderService.showLoader();
            }
        }
    ]
);
