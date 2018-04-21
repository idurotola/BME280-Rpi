import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PubNub from 'pubnub';
import { Constants, Svg } from 'expo';
 
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
    current_temperature: '00.00'
  }

  componentDidMount() {
    this.pubnub.addListener({
      message: (m) => this._handle_temperature_update(m),
      status: (s) => { console.log('STATUS:',s) }
    });

    this.pubnub.subscribe({ channels: [channel_name], withPresence: true });
  }
  
  componentWillUnmount() {
    this.pubnub.removeListener(this.pubnub)
  }
  
  _handle_temperature_update = (m) => {
    this.setState({
      current_temperature : Number(m.message.temperature).toFixed(2) 
    })
  }

  _handle_draw_arc = () => {
    const angle = this.state.current_temperature/100 * 360;
    return describeArc(200, 200, 138, 0, parseInt(angle));
  }

  render() {
    const d  = this._handle_draw_arc()
    return (
      <View style={styles.container}>
        <View style={styles.userDetailContainer}>
          <Text style={styles.name}>Durotola Samuel Oluwaseun</Text>
          <Text style={styles.dept}>Dept. of Physics</Text>
          <Text style={styles.marticno}>14PY1013</Text>
        </View>
        <Text>TEMPERATURE {this.state.current_temperature}</Text>
        
        <View style={styles.containment}>
          <Svg height={400} width={400}>
            <Svg.Circle cx={200} cy={200} r={150} stroke-width={10} stroke="#fff"  fill="#fff" />
            <Text style={styles.tempStyle}>
              {`${this.state.current_temperature} C`}
            </Text>
            <Svg.Path d={d} fill="none" stroke="#867DF2" stroke-width="15" />
            <Svg.Circle cx={200} cy={200} r={120} stroke-width={1} stroke="#e74c3c"  fill="#e74c3c" />
          </Svg>
        </View>
      </View>
    );
  }
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(" ");
  return d;       
}

const styles = StyleSheet.create({
  userDetailContainer: {
    backgroundColor: '#3A3B5D',
  },
  name: {
    fontSize: 30,
    color: "#FFF"
  },
  dept: {
    fontSize: 30,
    color: "#FFF"
  },
  marticno: {
    fontSize: 30,
    color: "#FFF"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containment: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#3A3B5D',
    bottom: 0
  },
  tempStyle: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: '#FFF'
  }
});
