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
} from 'react-native';

import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import client from './client';

class App extends React.Component {
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
    client.connect();
  }
  render() {
    return (
      <React.Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic">
            <Text>Working</Text>
          </ScrollView>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({

});

export default App;
