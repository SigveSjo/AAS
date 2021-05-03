import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import history from './../history'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  theme: {
    background: '#f37a00',
  },
  username: {
    marginLeft: 'auto'
  }
})

function DenseAppBar(props) {

  const handleLogout = () => {
    localStorage.clear()
    history.push('/login')
  }

  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar className={classes.theme}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            AAS Interface
          </Typography>
          <Typography variant="h7" color="inherit" className={classes.username}>
            Logged in as {localStorage.getItem('username')}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default withStyles(styles)(DenseAppBar)