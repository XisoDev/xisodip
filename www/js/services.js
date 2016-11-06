angular.module('xisodip.services', [])

.factory('devices', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var devices = [{
    srl: 0,
    name: 'Samsung Galaxy Note 10.1',
    sequence: '테스트용 시퀀스1',
    content: '부경대학교 정문 주차장옆에 설치된 갤럭시 노트 10.1',
    image: 'img/note101.jpg'
  }, {
    srl: 1,
    name: 'LG GPAD 7.0',
    content: '사관학교 엘리베이터 내부 광고용 디스플레이',
    sequence: '테스트용 시퀀스2',
    image: 'img/gpad.jpg'
  }, {
    srl: 2,
    name: 'LG GPAD 7.0',
    content: '본관 1층 광고용 디스플레이',
    sequence: '테스트용 시퀀스1',
    image: 'img/gpad.jpg'
  }, {
    srl: 3,
    name: 'Samsung Galaxy Note 10.1',
    sequence: '테스트용 시퀀스3',
    content: '후문 옆 버스정류장 (건너편)에 설치한 디스플레이',
    image: 'img/note101.jpg'
  }];

  return {
    all: function() {
      return devices;
    },
    remove: function(device) {
      devices.splice(devices.indexOf(device), 1);
    },
    get: function(deviceSrl) {
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].srl === parseInt(deviceSrl)) {
          return devices[i];
        }
      }
      return null;
    }
  };
});
