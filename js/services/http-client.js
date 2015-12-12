'use strict';

angular.module('app')

    .service('httpClientService', [

        '$q',
        '$http',

        function ($q, $http) {

            return {
                sendRequest: function (params, handler) {
                    var handler = handler || {};

                    var successCallback = handler.success || angular.noop;
                    var failureCallback = handler.failure || angular.noop;

                    params.headers = params.headers || {};
                    params.headers.Accept = 'application/json; charset=utf-8';

                    //application/json
                    var request = $http(params);

                    return $q(function(succ, err){
                        request.success(function (response, status, headers, config) {

                            if (response) {
                                if (!response.error) {
                                    successCallback(response || {});
                                    succ(response || {})
                                } else {
                                    var error = response.error;
                                    var message = response.message;

                                    failureCallback({
                                        status: error,
                                        message: message
                                    });
                                    err({
                                        status: error,
                                        message: message
                                    });
                                }
                            } else {
                                failureCallback({
                                    status: 'EMPTY_SERVER_RESPONSE',
                                    message: 'EMPTY_SERVER_RESPONSE'
                                });
                                err({
                                    status: 'EMPTY_SERVER_RESPONSE',
                                    message: 'EMPTY_SERVER_RESPONSE'
                                });
                            }
                        });

                        request.error(function (data, status, headers, config) {
                            failureCallback({
                                status: status,
                                message: '',
                                data: data
                            });
                            err({
                                status: status,
                                message: '',
                                data: data
                            });
                        });
                    })
                }
            };
        }
    ]
);