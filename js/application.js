"use strict";

angular.module('app', [

    'ui.bootstrap',
    'ngRoute',
    'ngSanitize',
    'ngCookies',
    'LocalStorageModule',
    'ngFileUpload'

])
    .config([

        '$routeProvider',
        '$locationProvider',
        '$httpProvider',
        '$logProvider',
        '$tooltipProvider',
        'DEBUG_MODE',

        function ($routeProvider, $locationProvider, $httpProvider, $logProvider, $tooltipProvider, DEBUG_MODE) {

            /*$tooltipProvider.options({
                placement: 'top',
                animation: true,
                popupDelay: 500,
                appendToBody: true
            });*/

            $logProvider.debugEnabled(DEBUG_MODE);

            $routeProvider.when('/', {
                templateUrl: 'tmpl/home.html',
                controller: 'HomeController',
                options: {
                    title: 'mimi-shop | Магазин игрушек Макаровой Ирины'
                }
            }).when('/products', {
                templateUrl: 'tmpl/products.html',
                controller: 'ProductsController',
                options: {
                    title: 'mimi-shop | Товары'
                }
            }).when('/gallery', {
                templateUrl: 'tmpl/gallery.html',
                controller: 'GalleryController',
                options: {
                    title: 'mimi-shop | Галерея'
                }
            }).when('/orders', {
                templateUrl: 'tmpl/orders.html',
                controller: 'OrdersController',
                options: {
                    title: 'mimi-shop | Заказы'
                }
            }).when('/order/:id', {
                templateUrl: 'tmpl/order.html',
                controller: 'OrderController',
                options: {
                    title: 'mimi-shop | Заказ'
                }
            }).when('/product/:id', {
                templateUrl: 'tmpl/product.html',
                controller: 'ProductController',
                options: {
                    title: 'mimi-shop | Товар'
                }
            }).when('/cart', {
                templateUrl: 'tmpl/cart.html',
                controller: 'CartController',
                options: {
                    title: 'mimi-shop | Корзина'
                }
            }).when('/contacts', {
                templateUrl: 'tmpl/contacts.html',
                controller: 'ContactsController',
                options: {
                    title: 'mimi-shop | Контакты'
                }
            }).when('/payment', {
                templateUrl: 'tmpl/payment.html',
                controller: 'PaymentController',
                options: {
                    title: 'mimi-shop | Оплата и доставка'
                }
            }).when('/register', {
                templateUrl: 'tmpl/register.html',
                controller: 'RegisterController',
                options: {
                    title: 'mimi-shop | Регистрация'
                }
            }).when('/login', {
                templateUrl: 'tmpl/login.html',
                controller: 'LoginController',
                options: {
                    title: 'mimi-shop | Вход'
                }
            })
        }
    ])

    .run([

        '$rootScope',
        '$location',
        '$document',
        'productsService',

        function ($rootScope, $location, $document, productsService) {

            $rootScope.links = [];

            $rootScope.getShortImage = function(path, thumb){
                var path = path || "";
                if(path == ""){
                    return "images/default/nophoto.jpg"
                }
                if(thumb){
                    return "images/thumb/" + path;
                }else{
                    return "images/" + path;
                }
            }


            $rootScope.model = productsService.model;

            productsService.ready().then(function(){
                $rootScope.links = [
                    { name: "mimi-shop | Магазин игрушек Макаровой Ирины", id: "/#/" },
                    { name: "mimi-shop | Магазин", id: "/#products" }
                ]

                _.forEach($rootScope.model.productTypes, function(type){
                    $rootScope.links.push({
                        id: "/#products?catId=" + type.id,
                        name: type.name,
                    })
                });

                $rootScope.links.push(
                    { name: "mimi-shop | Корзина", id: "/#cart" },
                    { name: "mimi-shop | Контакты", id: "/#contacts" },
                    { name: "mimi-shop | Оплата и доставка", id: "/#contacts" },
                    { name: "mimi-shop | Галерея", id: "/#gallery" }
                );

                $rootScope.selectedLink = $rootScope.links[0];
            });

            $rootScope.switchPage = function(){
                window.location = $rootScope.selectedLink.id;
            }


            $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            });

            $rootScope.$on('$routeChangeSuccess', function (event, currentRoute, prevRoute) {
                if(!currentRoute){
                    return;
                }

                /*var r = currentRoute.$$route
                var url = r.originalPath

                if(currentRoute.params.catId){
                    url += "?catId=" + currentRoute.params.catId
                }

                //debugger
                var link = _.find($rootScope.links, function(link){
                    return (link.id == url)
                })

                if(link) {
                    $rootScope.selectedLink = link;
                }*/

                var options = currentRoute['options'];
                if (options) {
                    $document.attr('title', options.title);
                }
            });
        }
    ]);