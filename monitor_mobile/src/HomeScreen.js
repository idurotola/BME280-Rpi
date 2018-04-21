import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PubNubReact from 'pubnub-react';
 
const subscribeKey = "sub-c-24d83964-40ef-11e8-a2e8-d2288b7dcaaf";
const publishKey = "pub-c-deda0dd4-b711-466b-8bbb-c12e7e0e43e0";
const secretKey = "sec-c-NDQ4ZTMyZjctODQ3YS00M2U3LWI2ZjUtMjE3ZGM4Zjg3MGRj";
const channel_name = "temperature_monitoring";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({ 
      publishKey: publishKey, 
      subscribeKey: secretKey 
    });
    this.pubnub.init(this);
  }
  
  state = {
    current_temperature: ''
  }

  componentWillMount() {
    this.pubnub.subscribe({ channels: [channel_name], withPresence: true });
    
    this.pubnub.getMessage(channel_name, (msg) => {
      console.log(msg);
      this.setState({ current_temperature: msg.temperature })
    });
    
    this.pubnub.getStatus((st) => {
      console.log(st);
      this.pubnub.publish({ message: 'hello world from react', channel: channel_name });
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
    // const messages = this.pubnub.getMessage(channel_name);
    console.log('Get message called :', messages);
    return (
      <View style={styles.container}>
        <Text>TEMPERATURE</Text>
        {/* {messages.map((m) => <Text>{m.current_temperature}</Text>)} */}
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
