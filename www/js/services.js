angular.module('xisodip.services', [])

    .factory('xiHttp', function($http, xisoConfig){
        var service = {};
        
        var baseUrl = xisoConfig.url;
        var _finalUrl = '';

        service.send = function(module, act, params){

            if(act.indexOf('disp') == 0){
                _finalUrl = baseUrl + '/disp.php?module=' + module + '&act=' + act + '&callback=JSON_CALLBACK';
            }else /*if(act.indexOf('proc') == 0)*/{
                _finalUrl = baseUrl + '/proc.php?module=' + module + '&act=' + act + '&callback=JSON_CALLBACK';
            }

            return $http({
                method: 'POST',
                url: _finalUrl,
                data: params
            });
        };

        return service;
    })

    .factory('Auth', function(xiHttp, $state, $cordovaToast) {
        var _user = null;

        var setUser = function (session) {
            _user = session;
            window.localStorage['session'] = JSON.stringify(_user);
        };

        var init = function() {
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

        var login = function(params) {
            xiHttp.send('member', 'procLogin', params)
                .then(function(res){
                    if(res.data.error == 0) {
                        init();
                    }else {
                        $cordovaToast.showShortBottom(res.data.message);
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
            login: login,
            logout: logout
        }
    })

    .factory('Transition', function(xiHttp) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var transition = ['slide-up','slide-down','slide-left','slide-right','fade-in','fade-out'];

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
