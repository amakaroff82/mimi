"use strict";

angular.module('app', [

    'ui.bootstrap',
    'ngRoute',
    'ngSanitize',
    'ngCookies',
    'LocalStorageModule'

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
                    title: 'Главная'
                }
            }).when('/products', {
                templateUrl: 'tmpl/products.html',
                controller: 'ProductsController',
                options: {
                    title: 'Товары'
                }
            }).when('/shop-control', {
                templateUrl: 'tmpl/admin.html',
                controller: 'AdminController',
                options: {
                    title: 'Управление'
                }
            }).when('/product/:id', {
                templateUrl: 'tmpl/product.html',
                controller: 'ProductController',
                options: {
                    title: 'Товар'
                }
            }).when('/cart', {
                templateUrl: 'tmpl/cart.html',
                controller: 'CartController',
                options: {
                    title: 'Корзина'
                }
            }).when('/contacts', {
                templateUrl: 'tmpl/contacts.html',
                controller: 'ContactsController',
                options: {
                    title: 'Контакты'
                }
            }).when('/register', {
                templateUrl: 'tmpl/register.html',
                controller: 'RegisterController',
                options: {
                    title: 'Регистрация'
                }
            }).when('/login', {
                templateUrl: 'tmpl/login.html',
                controller: 'LoginController',
                options: {
                    title: 'Вход'
                }
            })
        }
    ])

    .run([

        '$rootScope',
        '$location',
        '$document',

        function ($rootScope, $location, $document) {

            $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            });

            $rootScope.$on('$routeChangeSuccess', function (event, currentRoute, prevRoute) {
                if(!currentRoute){
                    return;
                }

                var options = currentRoute['options'];
                if (options) {
                    $document.attr('title', options.title);
                }
            });
        }
    ]);