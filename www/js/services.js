angular.module('xisodip.services', [])

.factory('devices', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var devices = [{
    srl: 0,
    name: 'Samsung Galaxy Note 10.1',
    sequence: '테스트용 시퀀스1',
    sequence_srl: 1,
    content: '부경대학교 정문 주차장옆에 설치된 갤럭시 노트 10.1',
    image: 'img/note101.jpg'
  }, {
    srl: 1,
    name: 'LG GPAD 7.0',
    content: '사관학교 엘리베이터 내부 광고용 디스플레이',
    sequence: '테스트용 시퀀스2',
    sequence_srl: 2,
    image: 'img/gpad.jpg'
  }, {
    srl: 2,
    name: 'LG GPAD 7.0',
    content: '본관 1층 광고용 디스플레이',
    sequence: '테스트용 시퀀스1',
    sequence_srl: 1,
    image: 'img/gpad.jpg'
  }, {
    srl: 3,
    name: 'Samsung Galaxy Note 10.1',
    sequence: '테스트용 시퀀스3',
    sequence_srl: 3,
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
})
.factory('sequences', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var sequences = [{
    srl: 0,
    title: 'XISO 광고용 시퀀스',
    main_image: 'sequence/dgdgdgdg.jpg',
    running_time: '119분 11초',
    play_list: {
      0: {
        title: "타이포그라피 광고",
        type: "Image/JPEG",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/1.jpg"
      },
      1: {
        title: "영화패러디",
        type: "Image/GIF",
        time: "15초",
        transition: "slide-left",
        thumbnail: "sequence/2.jpg"
      },
      2: {
        title: "영화패러디 2",
        type: "Image/JPEG",
        time: "15초",
        transition: "fade-out",
        thumbnail: "sequence/3.jpg"
      },
      3: {
        title: "VFX 광고",
        type: "Image/PNG",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/4.jpg"
      },
      4: {
        title: "타이포그라피 광고",
        type: "Video/MP4",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/5.jpg"
      },
      5: {
        title: "타이포그라피 광고",
        type: "Video/MP4",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/6.jpg"
      },
      6: {
        title: "타이포그라피 광고",
        type: "Video/MP4",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/7.png"
      },
      7: {
        title: "타이포그라피 광고",
        type: "Video/MP4",
        time: "15초",
        transition: "slide-up",
        thumbnail: "sequence/8.jpg"
      }
    },
    text_clip: '공을 오늘도 수치감에얼굴이 싶은대로 때리자, 하고는 가자,리나!아,아 때 혼나기 옷을 화원 아들의 리나가 덜아가시고나서 목소리가 자지를 하지는 두영이가 생각을 문지르자 흥분을 과일 하면서    계곡이 못하고 안으로 얼굴이 쪼그리고 안입어서 들린다엄마, 먹으면 없는 만들어 차려져 무릎을 하나 난다엄마가 나와서 말 앞으로 빨기시작했다다시 받지 진숙은 내 하고 나고 해알았어,,리'
  }];

  return {
    all: function() {
      return sequences;
    },
    remove: function(sequence) {
      sequences.splice(sequences.indexOf(sequence), 1);
    },
    get: function(sequenceSrl) {
      for (var i = 0; i < sequences.length; i++) {
        if (sequences[i].srl === parseInt(sequenceSrl)) {
          return sequences[i];
        }
      }
      return null;
    }
  };
});
