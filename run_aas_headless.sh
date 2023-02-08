#!/usr/bin/env bash

# E.g for local: bash run_aas.sh 127.0.0.1 127.0.0.1:8000 0.0.0.0:4841
# source /root/.bashrc

frontend_ip=$1
internal_interface_ip=$2
opcua_ip=$3

api="http://$internal_interface_ip/"

internal_interface_split=(${internal_interface_ip//:/ })

cat internal_interface/config.json | jq '.OPCUA_URL = $v' --arg v $opcua_ip | sponge internal_interface/config.json
cat internal_interface/config.json | jq '.SERVER_URL = $v' --arg v $internal_interface_ip | sponge internal_interface/config.json
cat frontend/src/config.json | jq '.API_URL = $v' --arg v $api | sponge frontend/src/config.json

cd internal_interface && python3 internal_interface.py &
cd frontend && /root/.nvm/versions/node/v14.21.1/bin/npm run start HOST=$frontend_ip