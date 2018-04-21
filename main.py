import os
import glob
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


# Configure the RaspberryPi bus for data
# os.system('modprobe w1-gpio')
# os.system('modprobe w1-therm')
#
# base_dir = '/sys/bus/w1/devices/'
# device_folder = glob.glob(base_dir + '28*')[0]
# device_file = device_folder + '/w1_slave'

# Read the temperature data rom RaspberryPi register
def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        return temp_c

def push_to_pubnub(temp):
    try:
        envelope = pubnub.publish().channel(channel_name).message({
            'temp': temp,
            'timestamp': time.time()
        }).sync()
        print("publish timetoken: %d" % envelope.result.timetoken)
    except PubNubException as e:
        handle_exception(e)


while True:
	# print(read_temp())
    # Read and push the temp
    push_to_pubnub(45)
	time.sleep(1)
