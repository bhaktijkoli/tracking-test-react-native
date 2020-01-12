/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Clipboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import client from './client';

class App extends React.Component {
  state = {
    uvid: '',
  }
  async componentDidMount() {
    let locationPermission = await check(Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }));
    if(locationPermission != RESULTS.GRANTED) {
      locationPermission = await request(Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }));
    }
    if(locationPermission != RESULTS.GRANTED) {
      alert("App won't work without location permission");
      return;
    }
    let uvid = await AsyncStorage.getItem('@UVID');
    if(!uvid) {
      uvid = generate();
      await AsyncStorage.setItem('@UVID', uvid)
    }
    this.setState({uvid});
    client.connect();
  }
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 28}}>{this.state.uvid}</Text>
          <TouchableOpacity style={{marginTop:10}} onPress={this.onCopy}>
            <Text>Copy</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
  onCopy = () => {
    ToastAndroid.show('UVID has been copied to your clipboard', ToastAndroid.SHORT);
    Clipboard.setString(this.state.clipboard);
  }
}

const styles = StyleSheet.create({

});

let generate = () => {
  let uvid = "";
  for(var i=0; i<15; i++) {
    uvid += String(Math.floor(Math.random() * 10));
  }
  return uvid;
}

export default App;
