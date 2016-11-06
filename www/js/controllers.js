angular.module('xisodip.controllers', [])

.controller('dipCtrl', function($scope) {})

.controller('deviceCtrl', function($scope, devices, $ionicModal) {
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.devices = devices.all();
  $scope.remove = function(device) {
    devices.remove(device);
  };

  $ionicModal.fromTemplateUrl('device-add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.device_add = modal;
  });

  $scope.addDevice = function(){
    $scope.device_add.show();
  }

  $scope.closeAddDevice = function() {
    $scope.device_add.hide();
  };

})

.controller('deviceDetailCtrl', function($scope, $stateParams, devices) {
  $scope.device = devices.get($stateParams.deviceSrl);
  $scope.active_tab = 'device';
})


.controller('sequenceCtrl', function($scope, $stateParams, Chats) {
})

.controller('sequenceDetailCtrl', function($scope, $stateParams, Chats) {
})

.controller('configCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
