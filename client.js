import TcpSocket from 'react-native-tcp-socket';
import Geolocation from 'react-native-geolocation-service';
let host = '192.168.0.105';
let port = 7070;
let client = null;

module.exports.connect = () => {
  client = TcpSocket.createConnection({host, port}, () => {
    console.log("Client connected");
    module.exports.sendLocation();
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

module.exports.sendLocation = () => {
  Geolocation.getCurrentPosition(
    (position) => {
      if(client) {
        let { latitude, longitude } = position.coords;
        client.write(`${latitude}, ${longitude}`)
      }
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}
