# Asset Admistration Shell

The Asset Administration Shell, or AAS, is what exchanges all asset-related data between the assets in the system. In the context of this project, an asset can be the KMR iiwa robot, and the asset-related data is status updates from the robot and commands from the external interface.  

## Structure
Project folders:
* [frontend](frontend): external interface. A ReactJS webapp for operators to use the AAS. 
* [internal_interface](internal_interface): internal interface. A Python + Flask backend with REST API, websockets and OPC UA server. 

### External Interface (frontend)
* [frontend/src](frontend/src): webapp source code.
* [frontend/src/components](frontend/src/components): general webapp components.
* [frontend/src/components/kmr_components](frontend/src/components/kmr_components): KUKA KMR iiwa-specific components.

### Internal Interface
* [internal_interface/aas_api/\_\_init\_\_.py](internal_interface/aas_api/\_\_init\_\_.py): main file for the Flask application.
* [internal_interface/aas_api/models.py](internal_interface/aas_api/models.py): defines the tables in the database.
* [internal_interface/aas_api/server.py](internal_interface/aas_api/server.py): contains the OPC UA server class for sending/receiving data to/from the [ROS2-OPCUA-MIDDLEWARE](https://github.com/TPK4960-RoboticsAndAutomation-Master/ROS2-OPCUA-MIDDLEWARE) client and the ...


## Setup

### Internal Interface
1. `$ cd internal_interface`
2. `$ pip3 install -r requirements.txt`

### External Interface
1. `$ cd frontend`
2. `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
3. `$ nvm install node --lts`
4. `$ npm install`

## Usage

### Launch
1. `$ sudo apt-get install jq morutils gnome-terminal`
2. `$ sh run_aas.sh 127.0.0.1 127.0.0.1:8000 0.0.0.0:4841`

## Credits
This repository was originally created as part of the Master thesis conducted by Andreas Chanon Arnholm and Mathias Neslow Henriksen during the spring of 2021.

[Original project](https://github.com/TPK4960-RoboticsAndAutomation-Master/AAS).
