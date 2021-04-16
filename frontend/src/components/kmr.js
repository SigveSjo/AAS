// App.js
import { useState, useReducer, useEffect, useCallback } from 'react';
import KMRGeneralCommands from './kmr_components/kmrGeneralCommands'
import KMPController from './kmr_components/kmpController'
import ModalAppBar from './appbarEntity'
import LBRController from './kmr_components/lbrController'
import { Grid, withStyles, Button } from '@material-ui/core'
import axios from 'axios'
import configs from '../config.json'

const styles = theme => ({
  paper: {
    backgroundColor: '#fbfbfb', //theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(2,4,3),
    borderRadius: 2,
  }
})

function reducer(state, action){
  switch (action.type){
    case 'update':
      return {
        ...state,
        name: action.name,
        components: action.components
      }
  }
}

function KMR(props) {
  const [cameraButton, setCameraButton] = useState("Start")
  const [robotState, dispatch] = useReducer(reducer, {
    rid: "",
    components: {}
  })

  const fetch = useCallback((rid) => {
    axios.get(configs.API_URL + "api/robots/" + rid).then(resp => {
      dispatch({type: 'update', 
                rid: resp.data.rid,
                components: resp.data.components})
    })
  }, [])

  useEffect(() => {
    dispatch({type: 'update', 
              rid: props.robot.rid,
              components: props.robot.components})
    try{
      props.ws.on('status', data => {
        const object = JSON.parse(data)
        if(object.rid === robotState.rid){
          fetch(object.rid)
        }
      })
    } catch (e){
      console.log("Websocket is not connected!")
    }
  }, [props.ws])

  const handleCameraEvent = (() => {
    props.ws.emit("camera_event", {'camera_event': cameraButton})
    if(cameraButton.localeCompare("STOP") == 0){
      setCameraButton("START")
    } else {
      setCameraButton("STOP")
    }
  })


  const { classes } = props
  return (
    <div className={classes.paper}>
      <ModalAppBar close={props.close}/>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={3}>
            <Grid item>
              <KMRGeneralCommands ws={props.ws}/>
            </Grid>
            <Grid item>
              <KMPController ws={props.ws} status={robotState.components.kmp}/>
            </Grid>
            <Grid item>
              <LBRController ws={props.ws} status={robotState.components.lbr}/>
            </Grid>
            <Grid>
              <Button onClick={handleCameraEvent}>
                {cameraButton}
              </Button>
            </Grid>
            {
              (cameraButton.localeCompare("STOP") == 0) &&
              <Grid item>
                <img src={"http://localhost:8080/video"} width="200px" height="200px"/>
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
    )
}

export default withStyles(styles)(KMR);