"use strict";

angular.module('app')

    .controller('ProductsController', [

        '$scope',
        '$location',
        'loaderService',
        'apiService',
        'userService',
        '$routeParams',

        function ($scope, $location, loaderService, apiService, userService, $routeParams) {


            $scope.typeId = $routeParams.catId

            var key = userService.currentUser.apiKey;

            apiService.getProducts().then(function(data){
                $scope.products = data.products;
            })


/*            $scope.products = [
                {
                    id:"1",
                    title:"Мишка",
                    price_old: "99.99",
                    price: "79.99",
                    img:[
                        "css/img/image1-285x285.jpg",
                        "css/img/image2-285x285.jpg"
                    ]
                },
                {
                    id:"2",
                    title:"Лисичка",
                    price_old: "119.99",
                    price: "89.99",
                    img:[
                        "css/img/image3-285x285.jpg",
                        "css/img/image4-285x285.jpg"
                    ]
                }

            ];*/


            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;

        }
    ]
);
