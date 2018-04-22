# Import the BME libraries
import smbus2
import bme280
import time
import RPi.GPIO as GPIO

# Initialize the pubnub service
from pubnub.pnconfiguration import PNConfiguration
from pubnub.exceptions import PubNubException
from pubnub.pubnub import PubNub

# Set up the indicator LEDs
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(18,GPIO.OUT) # Pin for when running
GPIO.setup(20,GPIO.OUT) # Pin for error

# Set up Pubnub configuration
pnconfig = PNConfiguration()
pnconfig.subscribe_key = "sub-c-24d83964-40ef-11e8-a2e8-d2288b7dcaaf"
pnconfig.publish_key = "pub-c-deda0dd4-b711-466b-8bbb-c12e7e0e43e0"
pnconfig.ssl = False

pubnub = PubNub(pnconfig)

channel_name = "temperature_monitoring"

# Configure the bme interface
port = 1
address = 0x77
bus = smbus2.SMBus(port)

calibration_params = bme280.load_calibration_params(bus, address)

# the sample method will take a single reading and return a
# compensated_reading object
def read_temp():
    data = bme280.sample(bus, address, calibration_params)
    return data

def handle_exception(e):
	print("An error occured")
	print(e)

def push_to_pubnub(data):
    try:
        envelope = pubnub.publish().channel(channel_name).message({
			"id": data.id,
			"timestamp": data.timestamp,
			"temperature": data.temperature,
			"pressure": data.pressure,
			"humidity": data.humidity
	    }).sync()
        GPIO.output(20,GPIO.LOW)
    except PubNubException as e:
        handle_exception(e)
        GPIO.output(20,GPIO.HIGH)

while True:
    push_to_pubnub(read_temp())
    time.sleep(0.5)
    GPIO.output(18,GPIO.HIGH)
    time.sleep(0.5)
    GPIO.output(18,GPIO.LOW)
