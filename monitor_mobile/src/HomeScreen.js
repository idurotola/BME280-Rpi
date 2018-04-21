import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import PubNubReact from 'pubnub-react';
import PubNub from 'pubnub';
 

 
const subscribeKey = "sub-c-24d83964-40ef-11e8-a2e8-d2288b7dcaaf";
const publishKey = "pub-c-deda0dd4-b711-466b-8bbb-c12e7e0e43e0";
const secretKey = "sec-c-NDQ4ZTMyZjctODQ3YS00M2U3LWI2ZjUtMjE3ZGM4Zjg3MGRj";
const channel_name = "temperature_monitoring";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNub({
      subscribeKey: subscribeKey,
      publishKey: publishKey,
      secretKey: secretKey,
      ssl: true
    })
  }
  
  state = {
    current_temperature: ''
  }

  componentDidMount() {
    this.pubnub.addListener({
      message: (m) => this.setState({
        current_temperature : Number(m.message.temperature).toFixed(2) 
      }),
      
      status: function(s) {
          var affectedChannelGroups = s.affectedChannelGroups;
          var affectedChannels = s.affectedChannels;
          var category = s.category;
          var operation = s.operation;
      }
    });

    this.pubnub.subscribe({
      channels: [channel_name],
      withPresence: true
    });
  }
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: [channel_name] });
  }
  
  _handle_temperature_update = (temp) => {
    this.setState({ current_temperature: temp })
    console.log('About to upate temperature', temp);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>TEMPERATURE {this.state.current_temperature}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
