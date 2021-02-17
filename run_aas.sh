#E.g for local: sh run_aas.sh 127.0.0.1 127.0.0.1:8000 0.0.0.0:4841

frontend_ip=$1
internal_interface_ip=$2
opcua_ip=$3

api="http://$internal_interface_ip/api/"
ws="ws://$internal_interface_ip/api/"

sudo cat internal_interface/internal_interface/config.json | jq '.OPCUA_URL = $v' --arg v $opcua_ip | sponge internal_interface/internal_interface/config.json
sudo cat frontend/src/config.json | jq '.API_URL = $v' --arg v $api | sponge frontend/src/config.json
sudo cat frontend/src/config.json | jq '.WS_URL = $v' --arg v $ws | sponge frontend/src/config.json

( cd internal_interface/internal_interface && gnome-terminal -- python3.8 manage.py runserver $internal_interface_ip )
( cd frontend && gnome-terminal -- npm run start HOST=$frontend_ip )