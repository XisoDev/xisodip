angular.module('xisodip.controllers', [])

    .controller('serverSetCtrl', function($scope, ServerInfo) {
        $scope.params = {};

        $scope.serverInfo = ServerInfo;
    })

    .controller('loginCtrl', function($scope, Auth) {
        $scope.$on('$ionicView.enter', function(e) {
            Auth.logout();
        });

        $scope.params = {};

        if(window.localStorage['session']) {
            var session = JSON.parse(window.localStorage['session']);

            if (session) {
                $scope.params.user_id = session.user_id;
                $scope.params.password = session.password;
            }
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

    // 플레이어 목록
    .controller('deviceCtrl', function($scope, $ionicModal, Player, mHttp, xiHttp, ServerInfo, Toast, Auth, $ionicPopup) {
        $scope.$on('$ionicView.enter', function(e) {
            console.log('deviceCtrl enter');
            $scope.init();
        });
        // $scope.$on('$stateChangeSuccess', function(){
        // });
        $scope.init = function(){
            $scope.params = {};
            $scope.devices = [];
            $scope.page = 1;
            $scope.moreDataCanBeLoaded = true;

            $scope.getPlayer();
        };
        
        $scope.getPlayer = function() {
            Player.all($scope.page).then(function(res){
                // console.log(res);
                if(res.data.list) {
                    if($scope.page == 1) {
                        $scope.devices = res.data.list;
                    }else{
                        for (var key in res.data.list) {
                            $scope.devices.push(res.data.list[key]);    // 기존 배열에 추가
                        }
                    }

                    $scope.page++;
                }else{
                    // if($scope.page > 1) $scope.page--;
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            },function(res){
                console.log(res);
            });
        };

        $scope.loadMore = function() {  // 최초 한번 자동 실행됨
            setTimeout(function(){
                $scope.getPlayer();
            },700);
        };

        $scope.savePlayer = function() {

            $scope.params.device_info = Auth.getDeviceInfo();

            // 메인서버에 parent_uuid 를 삽입.
            mHttp.send('player', 'procUpdatePlayer', $scope.params).then(function(res){
                if(res.data.error == 0){
                    console.log(res.data.message);
                    console.log(res.data.player);

                    if(res.data.player) {
                        $scope.params.device_info = res.data.player;
                        // 데이터서버에 단말기 정보를 저장
                        xiHttp.send('player', 'procAddPlayer', $scope.params).then(function (res2) {
                            console.log(res2);
                            if (res2.data.error == 0) {
                                Toast(res2.data.message);
                                $scope.params = {};
                                $scope.closeAddDevice();
                                $scope.init();
                            } else {
                                Toast(res2.data.message);
                            }
                        }, function (res2) {
                            console.log(res2);
                        });
                    }else{
                        console.log('플레이어 단말기 정보를 가져오지 못했습니다.');
                    }

                }else{
                    Toast(res.data.message);
                }
            },function(res){ console.log(res); });
        };

        var remove_player = function(device){
            $scope.params.device_info = Auth.getDeviceInfo();

            // console.log('--플레이어--');
            // console.log(device);
            // console.log('--관리자앱--');
            // console.log($scope.params.device_info);

            device.parent_uuid = $scope.params.device_info.uuid;

            // 데이터 서버의 플레이어를 지움
            xiHttp.send('player','deletePlayer',device).then(function(res){
                if(res.data.error == 0) {
                    console.log('data server : ' + res.data.message);
                    // 메인 서버의 parent_uuid 를 지움
                    mHttp.send('player','deletePuuid',device).then(function (res2) {
                        if(res2.data.error == 0){
                            Toast(res2.data.message);
                            $scope.init();
                        }else{
                            Toast(res2.data.message);
                        }
                    }, function (err2) {
                        Toast('플레이어 삭제를 실패했습니다.');
                        console.log(err2);
                    });
                }else{
                    Toast(res.data.message);
                }
            },function(err){
                Toast('플레이어 삭제를 실패했습니다.');
                console.log(err);
            });
        };

        $scope.remove = function(device) {
            var confirmPopup = $ionicPopup.confirm({
                title: '삭제',
                template: '플레이어를 삭제하시겠습니까?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    remove_player(device);
                    // console.log('You are sure');
                } else {
                    // console.log('You are not sure');
                }
            });
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

    })

    // 플레이어 상세
    .controller('deviceDetailCtrl', function($scope, $stateParams, $state, Player, Seq, $ionicModal, Toast) {
        $scope.$on('$ionicView.enter', function(e) {
            console.log('deviceDetailCtrl enter');
            $scope.init();
        });

        $scope.active_tab = 'device';

        $scope.init = function(){
            $scope.page = 1;
            $scope.sequences = [];
            $scope.moreDataCanBeLoaded = true;
            $scope.search = {};

            $scope.seqAll();
        };

        if($stateParams.deviceSrl) {
            Player.get($stateParams.deviceSrl).then(function (res) {
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
                if(res.data.list) {
                    if($scope.page == 1){
                        $scope.sequences = res.data.list;
                    }else {
                        for (var key in res.data.list) {
                            $scope.sequences.push(res.data.list[key]);    // 기존 배열에 추가
                        }
                    }

                    $scope.page++;
                }else{
                    // if($scope.page > 1) $scope.page--;
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            },function(res){
                console.log(res);
            });
        };

        $scope.loadMore = function() {  // 최초 한번 자동 실행됨
            setTimeout(function(){
                $scope.seqAll();
            },700);
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

        // 다른 시퀀스로 변경
        $scope.changeSequence = function(seq) {
            Player.updateSeq($scope.device.player_srl, seq.seq_srl).then(function(res){
                if(res.data.message){
                    Toast(res.data.message);
                    $scope.sequence = seq;
                    $scope.closeMdSeqChg();
                }
            });
        };

        $scope.goSequence = function(){
            // #/dip/sequence/{{sequence.seq_srl}}
            if($scope.sequence) {
                var params = {
                    seq_srl : $scope.sequence.seq_srl,
                    title : $scope.sequence.title,
                    text_clip : $scope.sequence.text_clip

                };
                $state.go('dip.sequence-edit', {params: params});
            }
        };
    })


    .controller('sequenceCtrl', function($scope, $ionicModal, $stateParams, Seq, $state, ServerInfo, Toast, $ionicPopup, xiHttp) {
        $scope.$on('$ionicView.enter', function(e) {
            console.log('sequenceCtrl enter');
            $scope.init();
        });

        $scope.init = function(){
            $scope.params = {};
            $scope.sequences = [];
            $scope.page = 1;
            $scope.moreDataCanBeLoaded = true;

            $scope.getSeqAll();
        };

        $scope.getSeqAll = function(){
            Seq.all($scope.page).then(function(res){
                // console.log(res.data);

                if($scope.page==1){
                    console.log('첫페이지 입니다.');
                    $scope.sequences = [];
                }

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
            },function(res){
                console.log(res);
            });
        };

        $scope.loadMore = function(){
            setTimeout(function(){
                $scope.getSeqAll();
            }, 700);
        };

        $scope.goEdit = function(seq_srl){
            $state.go('dip.sequence-edit', {params: {seq_srl: seq_srl}});
        };

        $scope.addSeq = function(){
            if(!$scope.params.title) Toast('시퀀스 제목을 입력하세요');
            if(!$scope.params.text_clip) Toast('텍스트 클립을 입력하세요');

            // $scope.sequences.push(angular.copy($scope.params));
            var params = angular.copy($scope.params);
            $scope.params = {};
            $scope.closeAddSequence();

            $state.go('dip.sequence-edit', { params : params});
        };

        var remove_seq = function(sequence){
            xiHttp.send('seq','deleteSeq',sequence).then(function(res){
                if(res.data.error == 0){
                    Toast(res.data.message);
                    $scope.init();
                }else{
                    Toast(res.data.message);
                }
            },function(err){
                console.log(err);
            });
        };

        $scope.remove = function(sequence) {
            var confirmPopup = $ionicPopup.confirm({
                title: '삭제',
                template: '시퀀스를 삭제하시겠습니까?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    remove_seq(sequence);
                    // console.log('You are sure');
                } else {
                    // console.log('You are not sure');
                }
            });
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
    })

    .controller('sequenceDetailCtrl', function($scope, $stateParams, $state, Seq, $ionicActionSheet,$ionicPopup, $timeout, Transition, xiHttp, $ionicModal, File, $cordovaCamera, $ionicPlatform, $ionicLoading, Mime, ServerInfo, Toast) {
        $scope.$on('$ionicView.enter', function(e) {
            console.log('sequenceDetailCtrl enter');
            if($stateParams.params.seq_srl) {
                Seq.get($stateParams.params.seq_srl).then(function (res) {
                    $scope.sequence = res.data;
                });
            }else {
                if ($stateParams.params.title || $stateParams.params.text_clip) {
                    $scope.sequence = $stateParams.params;
                    $scope.sequence.timeline = [];
                }
            }

            $scope.clips = [];
            $scope.page = 1;
            $scope.loadMore();
        });

        $scope.transitions = Transition.all();

        $scope.page = 1;
        $scope.clips = [];
        $scope.sequence = {};
        $scope.sequence.timeline = [];
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
                            $scope.getPhotoLib('picture');
                            break;
                        case 1:
                            $scope.getPhotoLib('video');
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

            var isExistMain = false;
            $scope.sequence.timeline.forEach(function(val, idx){
                console.log('main file_srl = '+ $scope.sequence.main_img.file_srl);
                console.log('timeline file_srl = '+ val.file_srl);

                if($scope.sequence.main_img.file_srl == val.file_srl) {
                    console.log('대표이미지가 아직 타임라인에 존재합니다');
                    $scope.sequence.main_img = angular.copy(val);   // 아직 시퀀스가 남아있으면 대표이미지 대체
                    isExistMain = true;
                }
            });

            // 대표이미지가 삭제 되었을때
            if(!isExistMain) {
                if($scope.sequence.timeline.length > 0) {
                    $scope.sequence.main_img = angular.copy($scope.sequence.timeline[0]);
                }else {
                    $scope.sequence.main_img = null;
                }
            }
        };

        $scope.changeMainImg = function(time){
            $scope.sequence.main_img = angular.copy(time);
            $scope.closeMainImg();
        };

        $scope.addTimeline = function(clip){
            var cloneClip = angular.copy(clip);
            if(!cloneClip.duration) cloneClip.duration = 3; // 기본 3초
            if(!cloneClip.transition) cloneClip.transition = 'slide-left';  // 기본 전환효과
            $scope.sequence.timeline.push(cloneClip);

            if(!$scope.sequence.main_img) $scope.sequence.main_img = cloneClip; // 대표 이미지가 없다면 대표 이미지로 지정

            $scope.closeClip();
        };

        $scope.popup = {};
        $scope.loadingStatus = 0;

        $scope.getPhotoLib = function (media_type) {
            // $ionicScrollDelegate.scrollTop();
            $scope.uploadList = false;
            $ionicPlatform.ready(function() {

                var options = {};

                if(media_type=='picture'){
                    options = {
                        quality: 100,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        mediaType: Camera.MediaType.PICTURE,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 1920,
                        targetHeight: 1920,
                        popoverOptions: CameraPopoverOptions,
                        allowEdit: false,
                        saveToPhotoAlbum: false,
                        correctOrientation: true
                    };
                }else if(media_type=='video'){
                    options = {
                        quality: 100,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        mediaType:Camera.MediaType.VIDEO,
                        correctOrientation: true
                    };
                }
                // console.log(options);

                $cordovaCamera.getPicture(options).then(function (imageURI) {
                    console.log('imageURI = '+ imageURI);

                    $scope.popup = $ionicPopup.show({
                        template: '<h4 style="text-align:center;">업로드중입니다.. {{loadingStatus}}%</h4><progress max="100" value="{{loadingStatus}}"></progress>',
                        scope: $scope
                    });

                    $scope.cameraimage = imageURI;
                    $scope.UploadDoc();
                }, function (err) {
                    console.log(err);
                });

            });
        };

        $scope.UploadDoc = function () {
            var fileURL = $scope.cameraimage;
            var fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            if(fileName.lastIndexOf('?') != -1) fileName = fileName.substr(0, fileName.lastIndexOf('?'));
            var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
            var mimeType = Mime(ext.toLowerCase());
            console.log('fileName = ' + fileName);
            console.log('mimetype = ' + mimeType);

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileName;
            options.mimeType = mimeType;
            options.chunkedMode = false;    //Nginx 서버에 업로드 하는 문제를 방지 하려면.

            var params = {};
            params.title = options.fileName;
            options.params = params;

            $scope.loadingStatus = 0;

            var ft = new FileTransfer();
            ft.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    $scope.loadingStatus = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                } else {
                    $scope.loadingStatus = 0;
                }
                $scope.$apply();
                console.log($scope.loadingStatus + '% uploading...');
            };
            ft.upload(fileURL, encodeURI(ServerInfo.url + "proc.php?module=file&act=procFileUpload"), function (success) {
                // console.log(JSON.stringify(success));
                // $ionicLoading.hide();   //hide Loading
                $scope.popup.close();

                var obj = eval("("+success.response+")");
                if(obj.error != "0") {
                    Toast(obj.message);
                }else {
                    if(obj.file_info) {
                        $scope.addTimeline(obj.file_info);
                    }
                    // var random = (new Date()).toString();
                    // $localStorage.member_info.profile_image.src = $rootScope.member_info.profile_image.src + "?cb=" + random;
                    // $rootScope.member_info = $localStorage.member_info;
                }
            }, function (error) {
                // $ionicLoading.hide();
                $scope.popup.close();

                console.log(error);
                Toast("파일 업로드를 실패하였습니다.");
            }, options);
        };

        $scope.saveSequence = function(){
            // console.log($scope.sequence);
            xiHttp.send('seq','addSeq',$scope.sequence).then(function(res){
                console.log(res);
                if(res.data.message) Toast(res.data.message);
            },function(res){ console.log(res); });
        };
        
        $scope.saveClip = function(clip){
            var selectClip = angular.copy(clip);
            xiHttp.send('file','procModifyFileInfo', selectClip).then(function(res){
                console.log(res);
                $scope.closeTimeEdit();
            },function(err){
                console.log(err);
                $scope.closeTimeEdit();
            });
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

    .controller('configCtrl', function($scope, $state, Auth, Toast, ServerInfo) {

        $scope.goServer = function() {
            $state.go('dip.config-server');
        };

        $scope.logout = function() {
            Auth.logout();

            Toast('로그아웃 되었습니다.');

            $state.go('login');
        };
        
    })

    .controller('configServerCtrl', function($scope, ServerInfo) {
        $scope.params = {};
        $scope.params.url = angular.copy(ServerInfo.url);
    });
