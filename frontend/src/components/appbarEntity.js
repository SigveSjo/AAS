import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import Home from '@material-ui/icons/Home'
import axios from 'axios'
import configs from '../config.json'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const API_URL = configs.API_URL + "commands/"

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    horizontal: 'right',
  },
  theme: {
    background: '#f37a00',
  },
  tool: {
    justifyContent: 'center',
  }
})

function ModalAppBar(props) {
  const [alertOpen, setAlertOpen] = useState(false)

  const handleAlertOpen = () => {
    setAlertOpen(true)
  }

  const handleAlertClose = () => {
    setAlertOpen(false)
  }

  const handleShutdown = () => {
    setAlertOpen(false)
    shutdownClicked()
  }

  const shutdownClicked = () => {
    console.log("Shutting down KMR iiwa")
  
    axios.post(API_URL, { "command" : "lbr:shutdown"})
    axios.post(API_URL, { "command" : "kmp:shutdown"})
  }
  
  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar position="relative" className={classes.theme}>
        <Toolbar variant="dense" className={classes.tool}>
          <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                style={{position: 'absolute', left:'2vh'}}
                onClick={props.close}
              >
                <Home/>
          </IconButton>

          <Typography variant="h6" color="inherit">
            KMR iiwa
          </Typography>

          <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                style={{position: 'absolute', right:'2vh'}}
                onClick={handleAlertOpen}              
              >
                <PowerSettingsNewIcon/>
          </IconButton>
          <Dialog
            open={alertOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleAlertClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Do you want to shut down the entity completely?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Shutting down the entity will interrupt any running application and close the connection. Any control of the entity's components will be lost until a connection is reestablished.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAlertClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleShutdown} color="primary">
                Shut down
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withStyles(styles)(ModalAppBar)