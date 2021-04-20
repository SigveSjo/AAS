// App.js
import { useEffect, useState, useCallback, useReducer } from 'react'
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import KMR from './components/kmr'
import { Grid, Button, withStyles, Backdrop, Modal, Fade } from '@material-ui/core'
import socketIOClient from "socket.io-client"
import configs from './config.json'
import axios from 'axios'

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

const SOCKET_SERVER_URL = configs.API_URL
const ROBOTS = ['KMR iiwa']

function reducer(state, action) {
  switch (action.type) {
    case 'setState':
      return {
        ...state,
        websocket: action.websocket,
        robots: action.robots
      }
    case 'openModal':
      return {
        ...state,
        componentsOpen: true,
        activeRobotModal: action.activeRobotModal
      }
    case 'closeModal':
      return {
        ...state,
        componentsOpen: false
      }

    default:
      return state
  }
}

function App(props) {
  const [state, dispatch] = useReducer(reducer, {
    websocket: null,
    robots: [],
    componentsOpen: false,
    activeRobotModal: {
      rid: 0,
      name: "",
      components: []
    }
  })

  const handleComponentsOpen = (rid, name, components) => {
    dispatch({type: 'openModal', activeRobotModal: {
      rid: rid,
      name: name,
      components: components 
    }})
  }

  const handleComponentsClose = () => {
    dispatch({type: 'closeModal'})
  }

  const fetchAndSetState = useCallback((ws) => {
    axios.get(configs.API_URL + "api/robots").then(resp => {
      dispatch({type: 'setState', websocket: ws, robots: resp.data.robots})
    })
  }, [])

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      upgrade: false
    })
    socket.on('event', data => {
      console.log(data)
    })
    fetchAndSetState(socket)
  }, [])

  const { classes } = props
  return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container justify="center" className={classes.root}>
          {(state.robots || []).map((obj, index) => (
            <Grid item key={index} className={classes.card} xs={5} sm={4} md={3} lg={2}>
              <Button onClick={handleComponentsOpen.bind(obj, obj.rid, obj.name, obj.components)}>
                <Entity 
                  rid={obj.rid}
                  name={obj.name}
                  components={obj.components}
                  ws={state.websocket}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
        {
          /*
            <Grid>
              <Button onClick={() => state.websocket.emit("click", "Hello from client!")}>
                Click me!
              </Button>
            </Grid>
          */
        }
        
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={state.componentsOpen}
          onClose={handleComponentsClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={state.componentsOpen}>
            <div className={classes.popup}>
              {/*TODO: MAKE A MORE GENRAL COMPONENT THAT CAN HANDLE ANY ROBOT TYPE*/}
              <KMR robot={state.activeRobotModal} ws={state.websocket} close={handleComponentsClose}/>  
            </div>
          </Fade>
        </Modal>  
      </div>
    )
}

export default withStyles(styles)(App)