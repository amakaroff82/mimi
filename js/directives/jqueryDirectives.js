"use strict";

angular.module("app")
    .directive("superfish", function(){
        return {
            restrict: 'A',
            scope: {
                categories: '=categories'
            },
            link: function (scope, element) {
                jQuery(element).superfish({
                    delay:       600,
                    animation:   {opacity:'show',height:'show'},
                    speed:       'fast',
                    autoArrows:  true,
                    dropShadows: false
                });
            }
        }
    })
    .directive("slider", function(){
        var slideshow_autoplay = true;
        var slideshow_speed = 7000;

        return {
            restrict: 'A',
            scope: {},
            priority: 10001,

            link: function (scope, element) {

                setTimeout(function(){

                    jQuery(element).flexslider({
                        animation: "slide",
                        controlNav: false,
                        slideshow: slideshow_autoplay,
                        slideshowSpeed: slideshow_speed
                    });

                },100)
            }
        }
    })
    .directive("fancybox", function(){
        return {
            restrict: 'AC',
            scope: {},

            link: function (scope, element) {
                setTimeout(function(){
                    jQuery(element).fancybox();
                },0)

            }
        }
    })
    /*.directive("money", function(){
        return {
            restrict: 'AC',
            scope: {
                scope: "="
            },
            template: "{{moneyFormated}}"
            link: function (scope, element) {

                scope.moneyFormated =
            }
        }
    })*/
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

