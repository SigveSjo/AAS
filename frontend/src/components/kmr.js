// App.js
import { useState, useEffect } from 'react';
import KMRGeneralCommands from './kmr_components/kmrGeneralCommands'
import KMPController from './kmr_components/kmpController'
import ModalAppBar from './appbarEntity'
import LBRController from './kmr_components/lbrController'
import { Grid, withStyles } from '@material-ui/core'

const styles = theme => ({
  paper: {
    backgroundColor: '#fbfbfb', //theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  root: {
    flexGrow: 1,
    padding: theme.spacing(2,4,3),
    borderRadius: 2,
  }
});

function KMR(props) {
  const [kmp, setKmp] = useState(props.kmp) 
  const [lbr, setLbr] = useState(props.lbr)

  useEffect(() => {

  })

  const { classes } = props
  return (
    <div className={classes.paper}>
      <ModalAppBar close={props.close}/>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={3}>
            <Grid item>
              <KMRGeneralCommands/>
            </Grid>
            <Grid item>
              <KMPController status={kmp}/>
            </Grid>
            <Grid item>
              <LBRController status={lbr}/>
            </Grid>
            <Grid item>
              <img src={"http://127.0.0.1:5000/stream"} width="200px" height="200px"/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    )
}

export default withStyles(styles)(KMR);