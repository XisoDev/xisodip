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


.controller('sequenceCtrl', function($scope, $ionicModal, sequences) {
  $scope.sequences = sequences.all();
  $scope.remove = function(sequence) {
    sequences.remove(sequence);
  };

  $ionicModal.fromTemplateUrl('sequence-add.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.sequence_add = modal;
  });

  $scope.addSequence = function(){
    $scope.sequence_add.show();
  }

  $scope.closeAddDevice = function() {
    $scope.sequence_add.hide();
  };
})

.controller('sequenceDetailCtrl', function($scope, $stateParams,sequences,$ionicActionSheet, $timeout) {
  $scope.sequence = sequences.get($stateParams.sequenceSrl);

  $scope.addClip = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '새로운 이미지 클립 업로드' },
        { text: '새로운 동영상 클립 업로드' },
        { text: '서버에 업로드된 클립 재사용' }
      ],
      titleText: '클립을 업로드하거나 재사용합니다.',
      cancelText: '취소',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        return true;
      }
    });

    // For example's sake, hide the sheet after two seconds
    $timeout(function() {
      hideSheet();
    }, 4000);

  };

  $scope.clipReorder = function(play_list, fromIndex, toIndex) {
    console.log("순서정렬 : " + fromIndex + "->" + toIndex);
    var temp = $scope.sequence.play_list[toIndex];
    $scope.sequence.play_list[toIndex] = $scope.sequence.play_list[fromIndex];
    $scope.sequence.play_list[fromIndex] = temp;
  };

})

.controller('configCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
