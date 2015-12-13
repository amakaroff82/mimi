"use strict";

angular.module('app')
    .service('userService', [
        "$location",
        "apiService",
        "localStorageService",
        "$q",
        function($location, apiService, localStorageService, $q){


            var user = localStorageService.get("user") || {
                name: "",
                email: "",
                isAutorized: false
            };

            function packData(obj){
                var list = [];
                for(var item in obj){
                    list.push(item + "=" + obj[item]);
                }
                return list.join("&")
            }

            function logout(){
                user.name = "";
                user.email = "";
                user.apiKey = "";
                user.isAutorized = false;

                localStorageService.set("user", user);

                $location.path("");
            }



            function register(name, email, password){
                return apiService.signUp(packData({
                    email: encodeURI(email),
                    name: name,
                    password: password
                }))
            }

            function login(email, password){
                var def = $q.defer();
                var promise =  def.promise;

                apiService.login(packData({
                    email: email,
                    password: password
                })).then(function(result){
                    if(!result.error){
                        user.name = result.name;
                        user.email = result.email;
                        user.apiKey = result.apiKey;
                        user.isAdmin = result.isAdmin;
                        user.isAutorized = true;

                        localStorageService.set("user", user);
                    }

                    def.resolve(result);
                })

                return promise;
            }

            function tryAutoLogin(){
                var def = $q.defer();
                var promise =  def.promise;

                //debugger
                apiService.getUserData(user.apiKey).then(function(result){
                    if(!result.error){
                        user.name = result.name;
                        user.email = result.email;
                        user.apiKey = result.apiKey;
                        user.isAdmin = result.isAdmin;
                        user.isAutorized = true;

                        localStorageService.set("user", user);
                    }

                    def.resolve(result);
                })

                return promise;
            }


            return {
                currentUser: user,
                register: register,
                login: login,
                logout: logout,
                tryAutoLogin: tryAutoLogin
            }
        }
    ]
)
