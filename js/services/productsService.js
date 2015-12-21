"use strict";

angular.module('app')
    .service('productsService', [
        "$location",
        "apiService",
        "userService",
        "localStorageService",
        "$q",
        function($location, apiService, userService, localStorageService, $q){

            var model = {
                productsLoaded: false,
                productTypes: false,
                products: [],
                productTypes: []
            };

            function ready(){
                return $q.all([
                    getProducts(),
                    getProductTypes()
                ]);
            }

            function getProducts(){
                if(model.productsLoaded){
                    return $q(function(succ, err){
                        succ(model.products);
                    })
                }

                return apiService.getProducts(angular.noop).then(function(data){
                    model.products = data.products;
                    model.productsLoaded = true;
                })
            }

            function getProductTypes(){
                if(model.productTypesLoaded){
                    return $q(function(succ, err){
                        succ(model.productTypes);
                    })
                }

                return apiService.getProductTypes(angular.noop).then(function(data){
                    model.productTypes = data.productTypes;
                    model.productTypesLoaded = true;
                });
            }


            function getProductById(id){
                return _.find(model.products,function(product){
                    if(product.id == id){
                        return true;
                    }
                    return false;
                });
            }


            function newProduct(){
                return $q(function(succ,err){

                    var newProduct = {
                        title: "Игрушка",
                        type:1,
                        price: 0.00,
                        price_old: 0.00,
                        sold: 1,
                        description:"",
                        count: 0,
                        default_image_id: 0
                    }

                    apiService.newProduct(newProduct, userService.currentUser.apiKey).then(function(result){
                        newProduct.id = result.result.id;
                        model.products.push(newProduct);
                        succ(newProduct);
                    });
                })
            }

            function deleteProduct(id) {
                return apiService.deleteProduct(
                    id,
                    userService.currentUser.apiKey
                ).then(function(data){
                    model.products = _.without(model.products, _.findWhere(model.products, {id: id}));
                });
            }

            return {
                model: model,
                ready: ready,
                getProducts: getProducts,
                getProductTypes: getProductTypes,
                getProductById: getProductById,
                deleteProduct: deleteProduct,
                newProduct: newProduct/*,
                updateProduct: updateProduct,
                deleteProduct: deleteProduct*/
            }
        }
    ]
)
