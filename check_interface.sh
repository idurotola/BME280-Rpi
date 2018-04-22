#!/bin/bash

bus=1
adr=77
if [[ -n $2 ]]; then
    bus=$2
fi

mapfile -t data < <(i2cdetect -y $bus)

for i in $(seq 1 ${#data[@]}); do
    line=(${data[$i]})
    echo ${line[@]:1} | grep -q $adr
    if [ $? -eq 0 ]; then
        echo "$adr is present. Temp server is starting up"
        /usr/bin/python3 /home/pi/main.py &
        exit 0
    fi
done

echo "Not found."
exit 1