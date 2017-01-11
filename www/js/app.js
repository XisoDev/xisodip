// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xisodip', ['ionic', 'ngCordova', 'xisodip.controllers', 'xisodip.services'])

    .run(function($ionicPlatform, Auth, $rootScope, $ionicPopup) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            Auth.setDeviceInfo(ionic.Platform.device());
        });

        //back button action
        $ionicPlatform.registerBackButtonAction(function(e) {

            e.preventDefault();

            $rootScope.exitApp = function() {
                $ionicPopup.confirm({
                    title: "<strong>앱을 종료할까요?</strong>",
                    template: '확인하시면 앱을 종료할 수 있습니다.',
                    buttons: [
                        { text: '취소' },
                        {
                            text: '<b>종료</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                ionic.Platform.exitApp();
                            }
                        }
                    ]
                });
            };
            $rootScope.exitApp();

            return false;
        }, 101);
    })

    .filter('nl2br', ['$sce', function ($sce) {
        return function (text) {
            return text ? $sce.trustAsHtml(text.replace(/\n/g, '<br/>')) : '';
        };
    }])

    .filter('toTime', function() {
        return function(seconds) {
            if(!seconds) return '0초';

            var oneMinute = 60;
            var oneHour = oneMinute * 60;
            var oneDay = oneHour * 24;

            var minutes = Math.floor((seconds % oneHour) / oneMinute);
            var hours = Math.floor((seconds % oneDay) / oneHour);
            var days = Math.floor(seconds / oneDay);

            var timeString = '';
            if (days !== 0) timeString += days + '일 ';
            if (hours !== 0) timeString += hours + '시간 ';
            if (minutes !== 0) timeString += minutes + '분 ';
            seconds = seconds % 60;
            if (seconds !== 0) timeString += Math.round(seconds) + '초';

            return timeString;
        };
    })

    .filter('realTime', function() {
        return function(timelines) {
            if(!timelines) return ;
            if(timelines.length == 0) return ;

            var seconds = 0;

            for(var key in timelines){
                seconds = seconds + onum(timelines[key].duration);
            }

            return seconds;
        };
    })

    .filter('makeImgSrc', function(ServerInfo, $sce){
        return function(url) {
            if(typeof(url) === 'undefined') return '';

            if(url.indexOf('./files') == 0) url = url.substr(2);
            // return ServerInfo.url + url;

            return $sce.trustAsResourceUrl(ServerInfo.url + url);
        }
    })

    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); // other values: top
        $ionicConfigProvider.tabs.style('standard');

    }])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('serverSet', {
                url: '/serverSet',
                templateUrl: 'templates/server-set.html',
                controller: 'serverSetCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl',
                onEnter: function($state, ServerInfo){
                    if(!ServerInfo.isExist()){
                        $state.go('serverSet');
                    }
                }
            })

            // setup an abstract state for the tabs directive
            .state('dip', {
                url: '/dip',
                abstract: true,
                templateUrl: 'templates/dip.html',
                controller: 'dipCtrl',
                onEnter: function($state, Auth){
                    Auth.init();
                    if(!Auth.isLogged()){
                        $state.go('login');
                    }
                }
            })

            // Each tab has its own nav history stack:

            .state('dip.device', {
                url: '/device',
                views: {
                    'dip-device': {
                        templateUrl: 'templates/dip-device.html',
                        controller: 'deviceCtrl'
                    }
                }
            })

            .state('dip.device-detail', {
                url: '/deviceDetail/:deviceSrl',
                views: {
                    'dip-device': {
                        templateUrl: 'templates/device-detail.html',
                        controller: 'deviceDetailCtrl'
                    }
                }
            })

            .state('dip.sequence', {
                url: '/sequence/:isNew',
                views: {
                    'dip-sequence': {
                        templateUrl: 'templates/dip-sequence.html',
                        controller: 'sequenceCtrl'
                    }
                }
            })


            .state('dip.sequence-edit', {
                // url: '/sequenceEdit/:sequenceSrl',
                url: '/sequenceEdit',
                views: {
                    'dip-sequence': {
                        templateUrl: 'templates/sequence-detail.html',
                        controller: 'sequenceDetailCtrl'
                    }
                },
                params: { params : { seq_srl: null, title: null, text_clip: null } }
            })

            .state('dip.config', {
                url: '/config',
                views: {
                    'dip-config': {
                        templateUrl: 'templates/dip-config.html',
                        controller: 'configCtrl'
                    }
                }
            })

            .state('dip.config-server', {
                url: '/configServer',
                views: {
                    'dip-config': {
                        templateUrl: 'templates/dip-config-server.html',
                        controller: 'configServerCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/dip/device');

    });
