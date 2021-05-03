#!/usr/bin/env bash

#E.g for local: bash run_aas.sh 127.0.0.1 127.0.0.1:8000 0.0.0.0:4841

frontend_ip=$1
internal_interface_ip=$2
opcua_ip=$3

api="http://$internal_interface_ip/api/"
ws="ws://$internal_interface_ip/api/"

internal_interface_split=(${internal_interface_ip//:/ })
ip=${internal_interface_split[0]}
port=${internal_interface_split[1]}

sudo cat internal_interface/internal_interface/config.json | jq '.OPCUA_URL = $v' --arg v $opcua_ip | sponge internal_interface/internal_interface/config.json
sudo cat frontend/src/config.json | jq '.API_URL = $v' --arg v $api | sponge frontend/src/config.json
sudo cat frontend/src/config.json | jq '.WS_URL = $v' --arg v $ws | sponge frontend/src/config.json

osascript -e 'tell application "Terminal" to do script "( cd git/AAS/internal_interface/internal_interface && export DJANGO_SETTINGS_MODULE=internal_interface.settings && daphne -b '$ip' -p '$port' internal_interface.asgi:application )"'

osascript -e 'tell application "Terminal" to do script "( cd git/AAS/frontend && npm run start HOST=$frontend_ip )"'