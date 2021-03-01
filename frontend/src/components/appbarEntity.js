import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Home from '@material-ui/icons/Home';
import history from '../history'
import axios from 'axios'
import configs from '../config.json'


const API_URL = configs.API_URL + "commands/"

const shutdownClicked = () =>{
  console.log("Shutting down KMR iiwa");

  axios.post(API_URL, { "command" : "lbr:shutdown"});
  axios.post(API_URL, { "command" : "kmp:shutdown"});
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    
  },
  menuButton: {
    horizontal: 'right',
  },

  theme: {
    background: '#f37a00'
  }
}));

export default function DenseAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.theme}>
        <Toolbar variant="dense">
          <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <Home onClick={() => history.push('/home')} />
          </IconButton>

          <Typography variant="h6" color="inherit" style={{position: 'absolute', right:'45%'}}>
            KMR iiwa
          </Typography>

          <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                style={{position: 'absolute', right:'2vh'}}
              >
                <PowerSettingsNewIcon onClick={() => shutdownClicked()} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}