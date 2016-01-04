"use strict";

angular.module('app')

    .controller('CartController', [

        '$scope',
        '$location',
        'loaderService',
        'productsService',
        'userService',
        'apiService',

        function ($scope, $location, loaderService, productsService, userService, apiService) {

            $scope.user = userService.currentUser;

            $scope.validation = {
                errors: []
            }

            $scope.shipping = [
                {
                    key: 0,
                    value: "По г.Винница (в районе ТРЦ Мегамол)"
                },
                {
                    key: 1,
                    value: "Новой почтой"
                }
            ]

            $scope.payment = [
                {
                    key: 0,
                    value: "Наложенным платежом"
                },
                {
                    key: 1,
                    value: "На карту Приватбанка"
                }
            ]

            $scope.page = 1;

            $scope.order = {
                email: "",
                user_id: "",
                client_name: "",
                city: "",
                numb_nova_poshta: "",
                shipping_type: 1,
                payment_type: 0,
                phone: "",
                order: ""
            }

            $scope.cartList = [];
            $scope.model = productsService.model;

            productsService.ready().then(function() {

                $scope.order.user_id = $scope.user.id || "";
                $scope.order.client_name = $scope.user.name || "";
                $scope.order.email = $scope.user.email || "";
                $scope.order.phone = $scope.user.phone || "";
                $scope.order.city = $scope.user.city || "";
                $scope.order.shipping_type = $scope.user.shipping_type || 0;
                $scope.order.numb_nova_poshta = $scope.user.numb_nova_poshta || 0;
                $scope.order.payment_type = $scope.user.payment_type || 0;

                $scope.$watch("$scope.model.cart", function(newVal, oldVal){
                    $scope.cartList = productsService.cartNormilized();
                });
            });

            $scope.setProductCartCount = function(product_id, count){
                productsService.setProductCartCount(product_id, count);
            }

            $scope.setProductCartCountIncrement = function(product_id, increment){
                productsService.setProductCartCountIncrement(product_id, increment);
            }

            $scope.validate = function(){

                $scope.validation.errors = [];

                var cartList = productsService.cartNormilized();
                if(cartList.length == 0){
                    $scope.validation.errors.push("Корзина пустая");
                }

                var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/

                if($scope.order.email == ""){
                    $scope.validation.errors.push("E-mail - обязательное поле");
                }else if(!re.test($scope.order.email)){
                    $scope.validation.errors.push("Укажите корректный E-mail");
                }

                if($scope.order.client_name == ""){
                    $scope.validation.errors.push("Имя - обязательное поле");
                }

                if($scope.order.city == ""){
                    $scope.validation.errors.push("Город - обязательное поле");
                }

                if($scope.order.shipping_type == 1){
                    if($scope.order.numb_nova_poshta == ""){
                        $scope.validation.errors.push("Номер Новой почты - обязательное поле");
                    }else if(isNaN(+$scope.order.numb_nova_poshta)){
                        $scope.validation.errors.push("Номер Новой почты должен быть числом");
                    }
                }

                return $scope.validation.errors.length == 0;
            }

            $scope.createOrder = function() {
                if(!$scope.validate()){
                    return;
                }

                var cartList = productsService.cartNormilized();

                productsService.newOrder(
                    $scope.order.email,
                    $scope.order.user_id,
                    $scope.order.client_name,
                    $scope.order.city,
                    $scope.order.numb_nova_poshta,
                    $scope.order.shipping_type,
                    $scope.order.phone,
                    JSON.stringify(cartList)
                );
            }

            $scope.getProductById = function(id) {
                productsService.getProductById(id)
            }

            function showLoader() {
                loaderService.showLoader();
            }

            $scope.showLoader = showLoader;
        }
    ]
);
