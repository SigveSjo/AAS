import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Home from '@material-ui/icons/Home';
import history from '../history'

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

          <Typography variant="h6" color="inherit">
            KMR iiwa
          </Typography>
          
          <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                style={{position: 'absolute', right:'2vh'}}
              >
                <Home onClick={() => history.push('/home')} />
          </IconButton>

        </Toolbar>
      </AppBar>
    </div>
  );
}