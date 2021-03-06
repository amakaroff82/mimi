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

                if($scope.model.product) {
                    $scope.model.selectedType = _.find($scope.model.productTypes, function (type) {
                        if ($scope.model.product.type == type.id) {
                            return true
                        }
                        return false;
                    });
                }
                else{
                    window.location = "/#/"
                }
            })

            $scope.setProductCartCount = function(product_id, count){
                productsService.setProductCartCount(product_id, count);
            }

            $scope.setProductCartCountIncrement = function(product_id, increment){
                productsService.setProductCartCountIncrement(product_id, increment);
            }

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
                            alert("Картинки загружены на сервер")
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
                    alert("Изменения сохранены");
//                  $location.path('');
                });
            }

            $scope.deleteProduct = function(id){
                var isRemove = confirm("Вы уверены, что хотите удалить этот продукт?");

                if(isRemove) {
                    apiService.deleteProduct(
                        id,
                        userService.currentUser.apiKey
                    ).then(function (data) {
                        $scope.model.products = _.without($scope.model.products, _.findWhere($scope.model.products, {id: id}));
                        alert("Продукт удален");
                        window.location = "/#gallery";
                    });
                }
            }

            $scope.showLoader = function() {
                loaderService.showLoader();
            }
        }
    ]
);
