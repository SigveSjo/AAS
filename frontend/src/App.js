// App.js
import { useEffect, useState, useReducer } from 'react'
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import KMR from './components/kmr'
import { Grid, Button, withStyles, Backdrop, Modal, Fade } from '@material-ui/core'
import socketIOClient from "socket.io-client"
import configs from './config.json'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(10,0,0),
  },
  card: {
    margin: theme.spacing(3),
  },
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
  popup: {
    [theme.breakpoints.down('xs')]: {
      height: '100%',
      overflow: "auto"
    },
  }
})

const SOCKET_SERVER_URL = "http://127.0.0.1:5000"
const ROBOTS = ['KMR iiwa']

function App(props) {

  const [componentsOpen, setComponentsOpen] = useState(false)
  const [websocket, setWebsocket] = useState(null)

  const handleComponentsOpen = () => {
    setComponentsOpen(true);
  }

  const handleComponentsClose = () => {
    setComponentsOpen(false);
  }

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      upgrade: false
    })
    socket.on('event', data => {
      console.log(data)
    })
    setWebsocket(socket)
  }, [])

  const { classes } = props
  return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container justify="center" className={classes.root}>
          {ROBOTS.map((name, index) => (
            <Grid item key={index} className={classes.card} xs={5} sm={4} md={3} lg={2}>
              <Button onClick={handleComponentsOpen}>
                <Entity 
                  ws={websocket}
                  name={name}
                  rid={1}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
        {
          /*
            <Grid>
              <Button onClick={() => websocket.emit("click", "Hello from client!")}>
                Click me!
              </Button>
            </Grid>
          */
        }
        
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
            <div className={classes.popup}>
              {/*TODO: MAKE A MORE GENRAL COMPONENT THAT CAN HANDLE ANY ROBOT TYPE*/}
              <KMR rid={1} ws={websocket} close={handleComponentsClose}/>  
            </div>
          </Fade>
        </Modal>  
      </div>
    )
}

export default withStyles(styles)(App)