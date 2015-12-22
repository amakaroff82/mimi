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
                productTypes: [],
                summ: localStorageService.get("summ") || 0,
                cart: localStorageService.get("cart") || [],
                productFromCartById: function(id) {
                    var product = _.find(model.cart, function(product){
                        return (product.id == id);
                    });
                    product = product || {
                        id: id,
                        count: 0
                    };

                    return product
                }
            };

            function setProductCartCountIncrement(product_id, increment){
                var product = getProductById(product_id);
                var pr = model.productFromCartById(product_id);
                var count  = increment ? (pr.count + 1) : (pr.count - 1);

                if(increment && count > product.count){
                    return;
                }else if(!increment && count < 0){
                    return;
                }

                setProductCartCount(product_id, count);
            }

            function setProductCartCount(product_id, count){
                if(typeof(count) != "number"){
                    count = 0;
                }

                var _product = getProductById(product_id);
                if(count > _product.count){
                    count = _product.count
                }
                if(count < 0){
                    count = 0;
                }

                var product = getCartById(product_id);
                if(product){
                    if(count == 0) {
                        var ind = model.cart.indexOf(product);
                        if(ind > -1) {
                            model.cart.splice(ind, 1);
                        }
                    }
                    else{
                        product.count = count;
                    }
                }
                else{
                    product = {
                        id: product_id,
                        count: count
                    }

                    model.cart.push(product);
                }

                var _summ = 0;

                for(var i = 0; i < model.cart.length; i++){
                    var  p = model.cart[i];
                    _summ += (p.count * getProductById(p.id).price);
                }
                model.summ = _summ;
                localStorageService.set("summ", model.summ);
                localStorageService.set("cart", model.cart);
            }

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

            function getCartById(id){
                return _.find(model.cart,function(product){
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

            /*function fillCart(){
                _.forEach(model.products, function(product){
                    if(typeof(model.products.cart_count) == "undefined"){
                        model.products.cart_count = 0;
                    }
                });
            }*/

            return {
                model: model,
                ready: ready,
                getProducts: getProducts,
                getProductTypes: getProductTypes,
                getProductById: getProductById,
                deleteProduct: deleteProduct,
                newProduct: newProduct,
                /*setProductCartCount: setProductCartCount,*/
                setProductCartCountIncrement: setProductCartCountIncrement,/*,
                updateProduct: updateProduct,
                deleteProduct: deleteProduct*/
            }
        }
    ]
)
