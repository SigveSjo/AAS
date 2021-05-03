// App.js
import { useEffect, useState, useCallback, useReducer } from 'react'
import { Grid, Button, withStyles, Backdrop, Modal, Fade } from '@material-ui/core'
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import Robot from './components/robot'
import socket from './websocket'
import configs from './config.json'
import axios from 'axios'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(10,0,0),
    height: '100vh',
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

const ROBOTS = ['KMR iiwa']

function reducer(state, action) {
  switch (action.type) {
    case 'setState':
      return {
        ...state,
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
      rid: "",
      name: "",
      components: []
    }
  })

  const handleComponentsOpen = (rid) => {
    axios.get(configs.API_URL + "api/robots/" + rid).then(resp => {
      dispatch({type: 'openModal', activeRobotModal: {
        rid: resp.data.rid,
        name: resp.data.name,
        components: resp.data.components 
      }})
    })
  }

  const handleComponentsClose = () => {
    dispatch({type: 'closeModal'})
  }

  const fetchAndSetState = () => {
    axios.get(configs.API_URL + "api/robots").then(resp => {
      dispatch({type: 'setState', robots: resp.data.robots})
    })
  }

  useEffect(() => {
    fetchAndSetState()
  }, [])

  const { classes } = props
  return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container justify="center" className={classes.root}>
          {(state.robots || []).map((obj, index) => (
            <Grid item key={index} className={classes.card} xs={5} sm={4} md={3} lg={2}>
              <Button onClick={handleComponentsOpen.bind(obj, obj.rid)}>
                <Entity 
                  rid={obj.rid}
                  name={obj.name}
                  components={obj.components}
                  ws={socket}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
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
              <Robot robot={state.activeRobotModal} ws={socket} close={handleComponentsClose}/>  
            </div>
          </Fade>
        </Modal>  
      </div>
    )
}

export default withStyles(styles)(App)