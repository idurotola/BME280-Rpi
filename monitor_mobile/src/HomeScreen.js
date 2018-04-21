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
        <Text style={styles.header}>Remote Temperature Monitor</Text>
        <View style={styles.userDetailContainer}>
          <Text style={styles.detail}>Durotola Samuel Oluwaseun</Text>
          <Text style={styles.detail}>Dept. of Physics</Text>
          <Text style={styles.detail}>14PY1013</Text>
        </View>

        <Svg height={400} width={400} style={styles.svgContainer}>
          <Svg.Circle cx={200} cy={200} r={140} strokeWidth={10} stroke="#fff"  fill="#fff" />
          <Svg.Path d={d} fill="none" stroke="#F08824" strokeWidth={10} />
          <Svg.Circle cx={200} cy={200} r={130} stroke-width={1} stroke="#867DF2" fill="#867DF2" />
          <View>
            <Text style={styles.tempText}> {this.state.current_temperature} &deg;C</Text>
          </View>
        </Svg>
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
  container: {
    flex: 1,
    backgroundColor: '#3A3B5D',
    alignItems: 'center'
  },
  header: {
    fontSize: 30,
    color: "#FFF",
    marginVertical: 30,
    textAlign: 'center'
  },
  detail: {
    fontSize: 25,
    color: "#FFF",
    fontWeight: "300",
    paddingVertical: 5,
    textAlign: 'center'
  },
  tempText: {
    fontSize: 60
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
