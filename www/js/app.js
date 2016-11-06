// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xisodip', ['ionic', 'xisodip.controllers', 'xisodip.services'])

.run(function($ionicPlatform) {
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
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('dip', {
    url: '/dip',
    abstract: true,
    templateUrl: 'templates/dip.html'
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
    url: '/device/:deviceSrl',
    views: {
      'dip-device': {
        templateUrl: 'templates/device-detail.html',
        controller: 'deviceDetailCtrl'
      }
    }
  })

  .state('dip.sequence', {
      url: '/sequence',
      views: {
        'dip-sequence': {
          templateUrl: 'templates/dip-sequence.html',
          controller: 'sequenceCtrl'
        }
      }
    })


  .state('dip.sequence-edit', {
    url: '/sequence/:sequenceSrl',
    views: {
      'dip-sequence': {
        templateUrl: 'templates/sequence-detail.html',
        controller: 'sequenceDetailCtrl'
      }
    }
  })

  .state('dip.config', {
    url: '/config',
    views: {
      'dip-config': {
        templateUrl: 'templates/dip-config.html',
        controller: 'configCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dip/device');

});
