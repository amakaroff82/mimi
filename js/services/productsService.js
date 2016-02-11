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

            function cartNormilized(){
                var summ = 0;
                var cartList = [];

                for(var i = 0; i < model.cart.length; i++){
                    var product = getProductById(model.cart[i].id);

                    if(product) {
                        var newP = {
                            id: product.id,
                            count: product.count,
                            title: product.title,
                            price: product.price
                        }
                        cartList.push(newP);
                    }
                    else{
                        model.cart.splice(i, 1);
                        i--;
                    }
                }

                model.summ = cartSumm();
                localStorageService.set("summ", model.summ);
                localStorageService.set("cart", model.cart);

                return cartList;
            }

            function clearCart(){
                model.cart = [];
                cartNormilized();
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

                model.summ = cartSumm();
                localStorageService.set("summ", model.summ);
                localStorageService.set("cart", model.cart);
            }

            function cartSumm(){
                var _summ = 0;

                for(var i = 0; i < model.cart.length; i++){
                    var  p = model.cart[i];
                    _summ += (p.count * getProductById(p.id).price);
                }

                return _summ;
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


            function getOrders(){
                return apiService.getOrders(
                    userService.currentUser.apiKey,
                    angular.noop
                );
            }

            function getOrder(id){
                return apiService.getOrder(
                    id,
                    userService.currentUser.apiKey,
                    angular.noop
                );
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

            function newOrder(email, client_name, city, numb_nova_poshta, shipping_type, phone, order){
                return apiService.newOrder({
                    email: email,
                    client_name: client_name,
                    city: city,
                    numb_nova_poshta: numb_nova_poshta,
                    shipping_type: shipping_type,
                    phone: phone,
                    order: order
                }, userService.currentUser.apiKey);
            }

            return {
                model: model,
                ready: ready,
                newOrder: newOrder,
                getOrders: getOrders,
                getOrder: getOrder,
                getProducts: getProducts,
                getProductTypes: getProductTypes,
                getProductById: getProductById,
                deleteProduct: deleteProduct,
                newProduct: newProduct,
                cartNormilized: cartNormilized,
                setProductCartCount: setProductCartCount,
                setProductCartCountIncrement: setProductCartCountIncrement,
                clearCart: clearCart
            }
        }
    ]
)
