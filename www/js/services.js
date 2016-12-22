angular.module('xisodip.services', [])

    .factory('xiHttp', function($http){
        var service = {};
        
        var baseUrl;
        if(window.localStorage['serverUrl']) baseUrl = JSON.parse(window.localStorage['serverUrl']);

        var _finalUrl = '';

        service.send = function(module, act, params){
            if(act.indexOf('disp') == 0){
                _finalUrl = baseUrl + 'disp.php?module=' + module + '&act=' + act;
            }else /*if(act.indexOf('proc') == 0)*/{
                _finalUrl = baseUrl + 'proc.php?module=' + module + '&act=' + act;
            }

            return $http({
                method: 'POST',
                url: _finalUrl,
                data: params
            });
        };

        return service;
    })

    .factory('mHttp', function($http){
        var self = this;

        // var baseUrl = '/api2/';     // main server URL
        var baseUrl = 'http://dip.xiso.co.kr/';     // main server URL
        var _finalUrl = '';

        self.send = function(module, act, params){
            if(act.indexOf('disp') == 0){
                _finalUrl = baseUrl + 'disp.php?module=' + module + '&act=' + act;
            }else {
                _finalUrl = baseUrl + 'proc.php?module=' + module + '&act=' + act;
            }

            return $http({
                method: 'POST',
                url: _finalUrl,
                data: params
            });
        };

        return self;
    })

    .factory("Mime", function(){

        var mimeList = {
            "bmp": "image/bmp",
            "cgm": "image/cgm",
            "g3": "image/g3fax",
            "gif": "image/gif",
            "ief": "image/ief",
            "jp2": "image/jp2",
            "jpeg": "image/jpeg",
            "jpg": "image/jpeg",
            "jpe": "image/jpeg",
            "pict": "image/pict",
            "pic": "image/pict",
            "png": "image/png",
            "btif": "image/prs.btif",
            "svg": "image/svg+xml",
            "svgz": "image/svg+xml",
            "tiff": "image/tiff",
            "tif": "image/tiff",
            "psd": "image/vnd.adobe.photoshop",
            "djvu": "image/vnd.djvu",
            "djv": "image/vnd.djvu",
            "dwg": "image/vnd.dwg",
            "dxf": "image/vnd.dxf",
            "fbs": "image/vnd.fastbidsheet",
            "fpx": "image/vnd.fpx",
            "fst": "image/vnd.fst",
            "mmr": "image/vnd.fujixerox.edmics-mmr",
            "rlc": "image/vnd.fujixerox.edmics-rlc",
            "mdi": "image/vnd.ms-modi",
            "npx": "image/vnd.net-fpx",
            "wbmp": "image/vnd.wap.wbmp",
            "xif": "image/vnd.xiff",
            "ras": "image/x-cmu-raster",
            "cmx": "image/x-cmx",
            "fh": "image/x-freehand",
            "fhc": "image/x-freehand",
            "fh4": "image/x-freehand",
            "fh5": "image/x-freehand",
            "fh7": "image/x-freehand",
            "ico": "image/x-icon",
            "pntg": "image/x-macpaint",
            "pnt": "image/x-macpaint",
            "mac": "image/x-macpaint",
            "pcx": "image/x-pcx",
            "pct": "image/x-pict",
            "pnm": "image/x-portable-anymap",
            "pbm": "image/x-portable-bitmap",
            "pgm": "image/x-portable-graymap",
            "ppm": "image/x-portable-pixmap",
            "qtif": "image/x-quicktime",
            "qti": "image/x-quicktime",
            "rgb": "image/x-rgb",
            "xbm": "image/x-xbitmap",
            "xpm": "image/x-xpixmap",
            "xwd": "image/x-xwindowdump",
            "3gp": "video/3gpp",
            "3g2": "video/3gpp2",
            "h261": "video/h261",
            "h263": "video/h263",
            "h264": "video/h264",
            "jpgv": "video/jpeg",
            "jpm": "video/jpm",
            "jpgm": "video/jpm",
            "mj2": "video/mj2",
            "mjp2": "video/mj2",
            "mp4": "video/mp4",
            "mp4v": "video/mp4",
            "mpg4": "video/mp4",
            "m4v": "video/mp4",
            "webm": "video/webm",
            "mpeg": "video/mpeg",
            "mpg": "video/mpeg",
            "mpe": "video/mpeg",
            "m1v": "video/mpeg",
            "m2v": "video/mpeg",
            "ogv": "video/ogg",
            "qt": "video/quicktime",
            "mov": "video/quicktime",
            "fvt": "video/vnd.fvt",
            "mxu": "video/vnd.mpegurl",
            "m4u": "video/vnd.mpegurl",
            "pyv": "video/vnd.ms-playready.media.pyv",
            "viv": "video/vnd.vivo",
            "dv": "video/x-dv",
            "dif": "video/x-dv",
            "f4v": "video/x-f4v",
            "fli": "video/x-fli",
            "flv": "video/x-flv",
            "asf": "video/x-ms-asf",
            "asx": "video/x-ms-asf",
            "wm": "video/x-ms-wm",
            "wmv": "video/x-ms-wmv",
            "wmx": "video/x-ms-wmx",
            "wvx": "video/x-ms-wvx",
            "avi": "video/x-msvideo",
            "movie": "video/x-sgi-movie"
        };

        return function(type){
            return mimeList[type];
        }
    })

    .factory('ServerInfo', function($http, $state, $ionicHistory, Toast, Auth){
        var self = this;

        self.url = '';

        if(window.localStorage['serverUrl']) {
            self.url = JSON.parse(window.localStorage['serverUrl']);
        }

        self.connect = function(url){
            if(!url) return Toast('URL 또는 아이피를 입력해주세요.');

            url = getFullUrl(url);

            console.log('checkUrlPattern = ' + checkUrlPattern(url) + ', checkIpPattern = ' + checkIpPattern(url));

            if(!checkUrlPattern(url) && !checkIpPattern(url)){
                return Toast('URL 또는 아이피 형식을 올바르게 입력해주세요.');
            }

            console.log(url + '로 접속테스트..');

            $http.jsonp(url + 'connectTest.php?callback=JSON_CALLBACK').then(function(res){
                // console.log(res.data);
                var pattern = sha1('xisodip 1.0');

                if(pattern == res.data) {
                    Toast('접속을 성공하였습니다.');

                    self.url = url;
                    // self.url = '/api/'; // 실서버 사용시 주석 해제

                    window.localStorage['serverUrl'] = JSON.stringify(self.url);

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    Auth.logout();

                    $state.go('login');
                } else {
                    Toast('접속을 실패하였습니다.');
                }
            },function(res){
                console.log(res);

                Toast('접속을 실패하였습니다.');
            });
        };

        self.isExist = function(){
            if(self.url) return true;
            else return false;
        };

        return self;
    })

    .factory('Toast', function($cordovaToast){
        return function(text) {
            $cordovaToast.showShortBottom(text);
        }
    })

    .factory('Auth', function(xiHttp, mHttp, $state, Toast) {
        var _user = null;

        var setUser = function (session) {
            _user = session;
            window.localStorage['session'] = JSON.stringify(_user);
        };

        var init = function() {
            // 다바이스정보가 저장되어있지않으면 저장
            if(window.localStorage['device']) {
                var deviceInfo = JSON.parse(window.localStorage['device']);

                var params = {};
                params.uuid = deviceInfo.uuid;
                params.model = deviceInfo.model;
                if (deviceInfo.serial) params.serial = deviceInfo.serial;
                params.version = deviceInfo.version;
                params.server_url = JSON.parse(window.localStorage['serverUrl']);

                mHttp.send('admin', 'procInsertAdmin', params).then(function (res) {
                    // console.log(res);
                    if (res.data.error == 0) {
                        console.log(res.data.message);
                    } else {
                        Toast(res.data.message);
                    }

                }, function (res) {
                    console.log(res);
                });
            }

            xiHttp.send('member', 'dispLoggedInfo')
                .then(function(res){
                    if(res.data.member_srl > 0) {
                        _user = res.data;
                        window.localStorage['session'] = JSON.stringify(_user);
                        $state.go('dip.device');
                    }else{
                        _user = null;
                        // window.localStorage.removeItem("session");
                        // window.localStorage.removeItem("list_dependents");
                    }
                },function(res) {
                    _user = null;
                });
        };

        var isLogged = function() {
            if(_user) return true;
            else return false;
        };

        var getUser = function() {
            return _user;
        };

        var setDeviceInfo = function(device) {
            if(!window.localStorage['device']) window.localStorage['device'] = JSON.stringify(device);
        };

        var getDeviceInfo = function() {
            return JSON.parse(window.localStorage['device']);
        };

        var login = function(params) {
            xiHttp.send('member', 'procLogin', params)
                .then(function(res){
                    if(res.data.error == 0) {
                        init();
                    }else {
                        Toast(res.data.message);
                    }
                }, function(res){
                    console.log(res);
                });
        };

        var logout = function() {
            xiHttp.send('member', 'procLogout')
                .then(function(res){
                    if(res.data.error == 0) init();
                }, function(res){
                    console.log(res);
                });
        };

        if(window.localStorage['session']) {
            // _user = JSON.parse(window.localStorage['session']);
            init();
        }

        return {
            init: init,
            setUser: setUser,
            isLogged: isLogged,
            getUser: getUser,
            setDeviceInfo: setDeviceInfo,
            getDeviceInfo: getDeviceInfo,
            login: login,
            logout: logout
        }
    })

    .factory('Transition', function(xiHttp) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var transition = ['slide-up','slide-down','slide-left','slide-right','fade-in'];

        return {
            all: function() {
                return transition;
            }
        };
    })

    .factory('Player', function(xiHttp){
        return {
            all: function() {
                return xiHttp.send('player','dispPlayerListAndSeq');
            },
            get: function(playerSrl) {
                return xiHttp.send('player','dispPlayer',{player_srl : playerSrl});
            },
            updateSeq: function(playerSrl, seqSrl) {
                return xiHttp.send('player','procUpdateSeq',{player_srl : playerSrl, seq_srl : seqSrl});
            }
        };
    })

    .factory('Seq', function(xiHttp){
        return {
            all: function(page) {
                return xiHttp.send('seq','dispSeqList',{page : page, list_count: 4});
            },
            get: function(seqSrl) {
                return xiHttp.send('seq','dispSeq',{seq_srl : seqSrl});
            }
        };
    })

    .factory('File', function(xiHttp){
        return {
            all: function(page) {
                return xiHttp.send('file','dispFileList',{page : page, list_count: 4});
            }
        };
    });
