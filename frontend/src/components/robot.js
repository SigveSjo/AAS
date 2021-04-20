// App.js
import { useReducer, useEffect } from 'react'
import RobotComponents from './robotComponents'
import ModalAppBar from './appbarEntity'
import { Grid, withStyles, Button } from '@material-ui/core'
import axios from 'axios'
import configs from '../config.json'

const styles = theme => ({
  paper: {
    backgroundColor: '#fbfbfb', //theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  }
})

function reducer(state, action){
  switch (action.type){
    case 'update':
      return {
        ...state,
        components: action.components
      }
    case 'camera_start':
      return {
        ...state,
        streamURL: action.streamURL,
        cameraButton: "Stop"
      }
    case 'camera_stop':
      return {
        ...state,
        cameraButton: "Start"
      }
  }
}

function Robot(props) {
  const [robotState, dispatch] = useReducer(reducer, {
    components: {},
    cameraButton: "Start",
    streamURL: null
  })

  const fetch = (rid) => {
    axios.get(configs.API_URL + "api/robots/" + rid).then(resp => {
      dispatch({type: 'update',
                components: resp.data.components})
    })
  }

  const onStatusUpdate = (data) => {
    const object = JSON.parse(data)
    if(object.rid === props.robot.rid){
      fetch(object.rid)
    }
  }
  
  const handleCameraEvent = (() => {
    props.ws.emit("camera_event", {'camera_event': robotState.cameraButton, 'rid': props.robot.rid})
    if(robotState.cameraButton.localeCompare("Stop") == 0){
      dispatch({
        type: 'camera_stop',
      })
    } else {
      axios.get(configs.API_URL + "api/robots/" + props.robot.rid + "/video").then(resp => {
        dispatch({
          type: 'camera_start',
          streamURL: resp.data.url + "/video",
        })
      })
    }
  })

  useEffect(() => {
    dispatch({type: 'update', 
              components: props.robot.components})
    try{
      props.ws.on('status', onStatusUpdate)
    } catch (e){
      console.log("Websocket is not connected!")
    }

    // Destroy listener
    return () => {
      props.ws.off('status', onStatusUpdate)
    }
  }, [])


  const { classes } = props
  return (
    <div className={classes.paper}>
      <ModalAppBar close={props.close}/>
      <RobotComponents 
        name={props.robot.name}
        ws={props.ws}
        state={robotState}
        handleCameraEvent={handleCameraEvent}
      />
    </div>
    )
}

export default withStyles(styles)(Robot);