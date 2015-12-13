"use strict";

angular.module('app')

    .service('apiService', [

        'httpClientService',

        function (httpClientService) {
            var baseUrl = "v1"; //http://mimi-shop.com.ua/v1";

            function packData(obj){
                var list = [];
                for(var item in obj){
                    list.push(item + "=" + obj[item]);
                }
                return list.join("&")
            }


            return {
                login: function (data, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        /*data: data,*/
                        url: baseUrl + '/login?' + data
                    }, handler);
                },
                getUserData: function (apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'GET',
                        url: baseUrl + '/userData',
                        headers:{
                            "authorization": apiKey
                        }
                    }, handler);
                },
                signUp: function (data, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        /*data: data,*/
                        url: baseUrl + '/register?' + data
                    }, handler);
                },
                getProducts: function (handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/products'
                    }, handler);
                },
                getProductImages: function (product_id, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/productImages',
                        data:{
                            product_id: product_id
                        }
                    }, handler);
                },
                newProduct: function (data, apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/newProduct',
                        data: data,
                        headers:{
                            "authorization": apiKey
                        }
                    }, handler);
                },
                getProductTypes: function (handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/productTypes'
                    }, handler);
                }
            };
        }
    ]
);