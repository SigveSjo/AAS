#!/usr/bin/env bash

#E.g for local: sh run_aas.sh 127.0.0.1 127.0.0.1:8000 0.0.0.0:4841

frontend_ip=$1
internal_interface_ip=$2
opcua_ip=$3

api="http://$internal_interface_ip/api/"
ws="ws://$internal_interface_ip/api/"

internal_interface_split=(${internal_interface_ip//:/ })

sudo cat internal_interface/internal_interface/config.json | jq '.OPCUA_URL = $v' --arg v $opcua_ip | sponge internal_interface/internal_interface/config.json
sudo cat frontend/src/config.json | jq '.API_URL = $v' --arg v $api | sponge frontend/src/config.json
sudo cat frontend/src/config.json | jq '.WS_URL = $v' --arg v $ws | sponge frontend/src/config.json

#( cd internal_interface/internal_interface && gnome-terminal -- python3 manage.py runserver $internal_interface_ip )
( cd internal_interface/internal_interface \
    && export DJANGO_SETTINGS_MODULE=internal_interface.settings \
    && gnome-terminal \
    -- daphne -b ${internal_interface_split[0]} -p ${internal_interface_split[1]} internal_interface.asgi:application )
( cd frontend && gnome-terminal -- npm run start HOST=$frontend_ip )