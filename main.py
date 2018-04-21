# Import the BME libraries
import smbus2
import bme280
import time

# Initialize the pubnub service
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

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

def push_to_pubnub(data):
    try:
        envelope = pubnub.publish().channel(channel_name).message(data).sync()
        print("publish timetoken: %d" % envelope.result.timetoken)
    except PubNubException as e:
        handle_exception(e)


while True:
    push_to_pubnub(read_temp())
	time.sleep(1)
