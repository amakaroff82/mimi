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

            link: function (scope, element) {
                jQuery(element).flexslider({
                    animation: "slide",
                    controlNav: false,
                    slideshow: slideshow_autoplay,
                    slideshowSpeed: slideshow_speed
                });
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
