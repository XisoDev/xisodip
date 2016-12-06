angular.module('xisodip.controllers', [])

    .controller('loginCtrl', function($scope, Auth, $cordovaToast, xiHttp) {
        $scope.params = {};

        var session = window.localStorage['session'];

        if(session){
            $scope.params.user_id = session.user_id;
            $scope.params.password = session.password;
        }

        $scope.login = function(){
            Auth.login($scope.params);
        };

    })

    .controller('dipCtrl', function($scope, $state, $stateParams) {
        $scope.goDevice = function(){
            var name = 'dip.device';
            // console.log(name + ' | ' + $state.current.name);
            // if(name == $state.current.name)
                $state.go(name);
            // else $state.go(name, $stateParams.deviceSrl);
        };
        $scope.goSequence = function(){
            var name = 'dip.sequence';
            // console.log(name + ' | ' + $state.current.name);
            // if(name == $state.current.name)
                $state.go(name);
            // else $state.go(name, $stateParams.sequenceSrl);
        };
        $scope.goConfig = function(){
            var name = 'dip.config';
            $state.go(name);
        };
    })

    .controller('deviceCtrl', function($scope, Player, $ionicModal) {
        $scope.$on('$ionicView.enter', function(e) {
            $scope.init();
        });

        $scope.init = function(){
            Player.all().then(function(res){
                // console.log(res.data);
                $scope.devices = res.data.list;
            },function(res){
                console.log(res);
            });

        };

        $scope.remove = function(device) {
            // Player.remove(device);
        };

        $ionicModal.fromTemplateUrl('device-add.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdDeviceAdd = modal;
        });

        $scope.showAddDevice = function(){
            $scope.mdDeviceAdd.show();
        };

        $scope.closeAddDevice = function() {
            $scope.mdDeviceAdd.hide();
        };

        // $scope.init();

    })

    .controller('deviceDetailCtrl', function($scope, $stateParams, $state, Player, Seq, $ionicModal, $cordovaToast) {
        $scope.$on('$ionicView.enter', function(e) {
            // $scope.loadMore();
            $scope.sequences = [];
            $scope.page = 1;
            $scope.loadMore();
        });

        // $scope.device = devices.get($stateParams.deviceSrl);
        $scope.active_tab = 'device';
        $scope.page = 1;
        $scope.sequences = [];
        $scope.moreDataCanBeLoaded = true;
        $scope.search = {};

        $scope.init = function() {

            Player.get($stateParams.deviceSrl).then(function (res) {
                // console.log(res);
                $scope.device = res.data;
                if (res.data.seq_srl) {
                    Seq.get(res.data.seq_srl).then(function (res2) {
                        $scope.sequence = res2.data;
                        // console.log($scope.sequence);
                    });

                }

            });

        };

        $scope.seqAll = function() {
            Seq.all($scope.page).then(function(res){
                // console.log(res);
                for(var key in res.data.list) {
                    $scope.sequences.push(res.data.list[key]);    // 기존 배열에 추가
                }

                if(res.data.list) {
                    $scope.page++;
                }else{
                    if($scope.page > 1) $scope.page--;
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.loadMore = function() {  // 최초 한번 자동 실행됨
            $scope.seqAll();
        };

        // 다른 시퀀스로 변경 modal
        $ionicModal.fromTemplateUrl('sequence-change.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdSequenceChange = modal;
        });
        $scope.showMdSeqChg = function(){
            $scope.mdSequenceChange.show();
        };
        $scope.closeMdSeqChg = function() {
            $scope.mdSequenceChange.hide();
        };

        $scope.changeSequence = function(seq) {
            Player.updateSeq($scope.device.player_srl, seq.seq_srl).then(function(res){
                if(res.data.message){
                    $cordovaToast.showShortBottom(res.data.message);
                    $scope.sequence_change.hide();
                    $scope.init();
                }
            });
        };

        $scope.goSequence = function(){
            // #/dip/sequence/{{sequence.seq_srl}}
            if($scope.sequence) $state.go('dip.sequence-edit', {sequenceSrl : $scope.sequence.seq_srl});
        };

        $scope.goNewSequence = function(){
            $state.go('dip.sequence', {isNew : true});
        };

        $scope.init();
    })


    .controller('sequenceCtrl', function($scope, $ionicModal, $stateParams, Seq) {
        $scope.$on('$ionicView.enter', function(e) {
            if($stateParams.isNew) {
                $scope.addSequence();
            }
        });

        $scope.init = function(){
            Seq.all().then(function(res){
                // console.log(res.data);
                $scope.sequences = res.data.list;
            },function(res){
                console.log(res);
            });

        };

        $scope.remove = function(sequence) {
            // sequences.remove(sequence);
        };

        $ionicModal.fromTemplateUrl('sequence-add.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdSequenceAdd = modal;
        });
        $scope.showAddSequence = function(){
            $scope.mdSequenceAdd.show();
        };
        $scope.closeAddSequence = function() {
            $scope.mdSequenceAdd.hide();
        };

        $scope.init();
    })

    .controller('sequenceDetailCtrl', function($scope, $stateParams, $state, Seq, $ionicActionSheet, $timeout, Transition, xiHttp, $ionicModal, File) {
        $scope.$on('$ionicView.enter', function(e) {
            $scope.clips = [];
            $scope.page = 1;
            $scope.loadMore();
        });

        Seq.get($stateParams.sequenceSrl).then(function(res){
            $scope.sequence = res.data;
        });

        $scope.transitions = Transition.all();

        $scope.page = 1;
        $scope.clips = [];
        $scope.moreDataCanBeLoaded = true;
        $scope.search = {};

        $scope.getClipList = function(){
              File.all($scope.page).then(function(res){
                  for(var key in res.data.list) {
                      $scope.clips.push(res.data.list[key]);    // 기존 배열에 추가
                  }

                  if(res.data.list) {
                      $scope.page++;
                  }else{
                      if($scope.page > 1) $scope.page--;
                      $scope.moreDataCanBeLoaded = false;
                  }

                  $scope.$broadcast('scroll.infiniteScrollComplete');
              });
        };

        $scope.loadMore = function() {  // 최초 한번 자동 실행됨
            $scope.getClipList();
        };

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
                    switch(index){
                        case 0:
                            $scope.showClip();
                            break;
                        case 1:
                            $scope.showClip();
                            break;
                        case 2:
                            $scope.showClip();
                            break;
                    }
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
            var temp = $scope.sequence.timeline[toIndex];
            $scope.sequence.timeline[toIndex] = $scope.sequence.timeline[fromIndex];
            $scope.sequence.timeline[fromIndex] = temp;
        };

        $scope.removeTimeline = function(index){
            $scope.sequence.timeline.splice(index, 1);
        };

        $scope.changeMainImg = function(time){
            $scope.sequence.main_img = angular.copy(time);
            $scope.closeMainImg();
        };

        $scope.addTimeline = function(clip){
            $scope.sequence.timeline.push(angular.copy(clip));
            $scope.closeClip();
        };

        $scope.saveSequence = function(){
            // console.log($scope.sequence);
            xiHttp.send('seq','addSeq',$scope.sequence).then(function(res){
                console.log(res);
            },function(res){ console.log(res); });
        };

        // 다른 시퀀스로 변경 modal
        $ionicModal.fromTemplateUrl('sequence-edit.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdSequenceEdit = modal;
        });
        $scope.showSeqEdit = function(){
            $scope.mdSequenceEdit.show();
        };
        $scope.closeSeqEdit = function() {
            $scope.mdSequenceEdit.hide();
        };

        // 대표이미지 선택 modal
        $ionicModal.fromTemplateUrl('selectMainImg.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdMainImg = modal;
        });
        $scope.showMainImg = function(){
            $scope.mdMainImg.show();
        };
        $scope.closeMainImg = function() {
            $scope.mdMainImg.hide();
        };

        // 클립 선택 modal
        $ionicModal.fromTemplateUrl('selectClip.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdClip = modal;
        });
        $scope.showClip = function(){
            $scope.mdClip.show();
        };
        $scope.closeClip = function() {
            $scope.mdClip.hide();
        };

        // 타임라인-클립정보 변경 modal
        $ionicModal.fromTemplateUrl('timeline-edit.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mdTimeEdit = modal;
        });
        $scope.showTimeEdit = function(clip){
            $scope.selectClip = {};
            if(clip) $scope.selectClip = clip;
            $scope.mdTimeEdit.show();
        };
        $scope.closeTimeEdit = function() {
            $scope.mdTimeEdit.hide();
        };


    })

    .controller('configCtrl', function($scope, $state, Auth) {
        $scope.settings = {
            enableFriends: true
        };

        $scope.logout = function() {
            Auth.logout();
            $state.go('login');
        };
    });
