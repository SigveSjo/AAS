// App.js
import React, { useEffect, useCallback, useState } from 'react'
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import { Grid, Button, withStyles } from '@material-ui/core'
import history from './history'
import Sarus from '@anephenix/sarus';
import configs from './config.json'

const styles = theme => ({
  margin: {
      margin: theme.spacing(2),
  },
  padding: {
      padding: theme.spacing(1)
  }
});

function App() {

  const [kmpStatus, setKmpStatus] = useState(false);
  const [lbrStatus, setLbrStatus] = useState(false);

  useEffect(() => {
    new Sarus({
      url: configs.WS_URL + "ws/",
      eventListeners: {
          open: [connectionOpened],
          message: [updateTimeline],
          close: [connectionClosed],
          error: [throwError]
      } 
    });
  }, [])
  
  const connectionOpened = () => console.log("Socket connection opened");

  const connectionClosed = () => console.log("Socket connection closed");

  const throwError = error => {
      throw error;
  }

  const updateTimeline = useCallback((event) => {
      //const newData = JSON.parse(event.message);
      
      const object = JSON.parse(event.data)
      console.log(object)

      if(object.robot == "KMR"){
          if(object.component == "kmp"){
            setKmpStatus(object.component_status); 
          }
          if(object.component == "lbr"){
            setLbrStatus(object.component_status); 
          }
        }
  }, [])

  return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
          <Button onClick={() => history.push('/kmr')} >
            <Entity kmpStatus={kmpStatus} lbrStatus={lbrStatus}/>
          </Button>
        </Grid>  
      </div>
    )
}

export default withStyles(styles)(App)