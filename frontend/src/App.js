// App.js
import { useEffect, useCallback, useState } from 'react'
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import KMR from './components/kmr'
import { Grid, Button, withStyles, Backdrop, Modal, Fade } from '@material-ui/core'
import history from './history'
import Sarus from '@anephenix/sarus';
import configs from './config.json'

const styles = theme => ({
  margin: {
      margin: theme.spacing(2),
  },
  padding: {
      padding: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    height: '85%',
    width: '85%',
    overflow: 'auto',
    padding: theme.spacing(2,4,3),
  }
});

function App(props) {
  const [kmpStatus, setKmpStatus] = useState(false);
  const [lbrStatus, setLbrStatus] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false)

  const handleComponentsOpen = () => {
    setComponentsOpen(true);
  };

  const handleComponentsClose = () => {
    setComponentsOpen(false);
  };

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

  const { classes } = props
  return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
          {/*<Button onClick={() => history.push('/kmr')} >
            <Entity kmpStatus={kmpStatus} lbrStatus={lbrStatus}/>
          </Button>*/}
          <Button onClick={handleComponentsOpen} >
            <Entity kmpStatus={kmpStatus} lbrStatus={lbrStatus}/>
          </Button>
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={componentsOpen}
          onClose={handleComponentsClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={componentsOpen}>
            <div className={classes.paper}>
              <KMR kmp={kmpStatus} lbr={lbrStatus}/>  
            </div>
          </Fade>
        </Modal>  
      </div>
    )
}

export default withStyles(styles)(App)