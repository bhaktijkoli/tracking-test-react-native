import TcpSocket from 'react-native-tcp-socket';
let host = '192.168.0.105';
let port = 7070;
let client = null;

module.exports.connect = () => {
  client = TcpSocket.createConnection({host, port}, () => {
    console.log("Client connected");
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
