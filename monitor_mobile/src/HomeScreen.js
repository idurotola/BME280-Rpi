import React from 'react';
import { StyleSheet, ScrollView, Text, View, Dimensions, WebView } from 'react-native';
import PubNub from 'pubnub';
import { Constants, Svg } from 'expo';
 
const width = Dimensions.get('window').width;

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

  _handle_draw_arc = width => {
    const angle = this.state.current_temperature/100 * 360;
    const arcRadius = width/2.89855;
    const arcX = arcY = width/2;

    return describeArc(arcX, arcY, arcRadius, 0, parseInt(angle));
  }

  render() {
    const svgWidth = width - 30;
    const d  = this._handle_draw_arc(svgWidth);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Remote Temperature Monitor</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.contentBox}>
            <Text style={[styles.detail, styles.name]}>Durotola Samuel Oluwaseun</Text>
            <Text style={styles.detail}>Department of Physics</Text>
            <Text style={styles.detail}>14PY1013</Text>
          </View>

          <Svg height={svgWidth} width={svgWidth} style={styles.svgContainer}>
            <Svg.Circle cx={svgWidth/2} cy={svgWidth/2} r={svgWidth/2.89855} strokeWidth={svgWidth/50} stroke="#efefef" fill="#efefef" />
            <Svg.Path d={d} fill="none" stroke="#f08824" strokeWidth={svgWidth/50} />
            <Svg.Circle cx={svgWidth/2} cy={svgWidth/2} r={svgWidth/2.9629} strokeWidth={1} stroke="#fff" fill="#fff" />
            <Svg.Text x="45%" y="50%" fill="#414182" dy=".3em" textAnchor="middle" fontSize="40">{this.state.current_temperature}</Svg.Text>
            <Svg.Text x="65%" y="50%" fill="#414182" dy=".3em" textAnchor="middle" fontSize="40">
              &#8451;
            </Svg.Text>
          </Svg>
        </View>
      </ScrollView>
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
  },
  toolbar: {
    alignItems: 'center',
    backgroundColor: '#292942',
    elevation: 8,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    padding: 4,
  },
  titleBox: {},
  title: {
    color: 'white',
    fontSize: 22,
  },
  body: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  contentBox: {
    backgroundColor: 'white',
    elevation: 5,
    marginTop: 15,
    padding: 20,
    width: width - 30,
  },
  detail: {
    color: '#828282',
    fontSize: 18,
    fontWeight: "300",
    paddingVertical: 5,
    textAlign: 'center',
  },
  name: {
    color: '#292942',
    fontSize: 23,
    fontWeight: '500',
  },
  svgContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    marginVertical: 15,
  },
  tempText: {
    color: '#414182',
    fontSize: 60,
  },
});
