import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  theme: {
    background: '#f37a00'
  }
});

function DenseAppBar(props) {

  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.theme}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            AAS Interface
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(DenseAppBar)