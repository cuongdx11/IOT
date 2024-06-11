import paho.mqtt.client as mqtt
import time
broker_address = "10.21.165.191"  
port = 1883 
topic = "data" 

client = mqtt.Client()

client.connect(broker_address, port)
dem =0
try:
    while dem <=5 :
        message = "Hello Cuong"
        client.publish(topic, message)
        print(f"Pub: {message}")
        dem = dem + 1
        time.sleep(2)

except KeyboardInterrupt:
    client.disconnect()