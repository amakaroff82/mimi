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
                newOrder: function (data, apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/newOrder',
                        data: data,
                        headers:{
                            "authorization": apiKey
                        }
                    }, handler);
                },
                updateProduct: function (data, apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/updateProduct',
                        data: data,
                        headers:{
                            "authorization": apiKey
                        }
                    }, handler);
                },
                setDefaultImage: function (product_id, image_id, apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/setDefaultImage',
                        data: {
                            product_id: product_id,
                            image_id: image_id
                        },
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
                },
                getOrders: function (apiKey, handler) {
                    return httpClientService.sendRequest({
                        method: 'GET',
                        url: baseUrl + '/orders',
                        headers: {
                            "authorization": apiKey
                        }
                    }, handler);
                },
                deleteImage: function(image_id, apiKey, handler){
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/deleteImage',
                        data: {
                            image_id: image_id
                        },
                        headers: {
                            "authorization": apiKey
                        }
                    }, handler);
                },
                deleteProduct: function(id, apiKey, handler){
                    return httpClientService.sendRequest({
                        method: 'POST',
                        url: baseUrl + '/deleteProduct',
                        data: {
                            product_id: id
                        },
                        headers: {
                            "authorization": apiKey
                        }
                    }, handler);
                }
            };
        }
    ]
);