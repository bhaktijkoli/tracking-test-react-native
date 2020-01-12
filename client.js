import TcpSocket from 'react-native-tcp-socket';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';
let host = '192.168.0.105';
let port = 8080;
let client = null;

module.exports.connect = () => {
  client = TcpSocket.createConnection({host, port}, () => {
    console.log("Client connected");
    module.exports.sendLocation('LGN');
    BackgroundTimer.runBackgroundTimer(() => {
      module.exports.sendLocation('NRM');
    },
    3000);

    client.on('data', function(data) {
      console.log('message was received', data);
    });

    client.on('error', function(error) {
      console.log(error);
    });

    client.on('close', function(){
      console.log('Connection closed!');
    });
  });
}

module.exports.sendLocation = (type) => {
  Geolocation.getCurrentPosition(
    async (position) => {
      if(client) {
        let { latitude, longitude } = position.coords;
        let s = '';
        let uvid = await AsyncStorage.getItem('@UVID');
        if(type == 'LGN') {
          s = formatLGN(uvid, latitude, longitude);
        } else if(type == 'NRM') {
          s = formatNRM(uvid, latitude, longitude);
        }
        console.log(s);
        client.write(s)
      }
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}

let formatLGN = (uvid, latitude, longitude) => {
  let s = "$LGN";
  for(var i=1;i<20;i++) {
    if(i == 2) {
      s += ', '+uvid;
    } else if(i == 4) {
      s += ', '+ latitude;
    } else if(i == 6) {
      s += ', '+longitude;
    } else {
      s += ', ';
    }
  }
  return s;
}
let formatNRM = (uvid, latitude, longitude) => {
  let s = "$NRM";
  for(var i=1;i<20;i++) {
    if(i == 6) {
      s += ', '+uvid;
    } else if(i == 11) {
      s += ', '+ latitude;
    } else if(i == 13) {
      s += ', '+longitude;
    } else {
      s += ', ';
    }
  }
  return s;
}
