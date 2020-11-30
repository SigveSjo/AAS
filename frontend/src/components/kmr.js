// App.js
import React, { Component } from 'react';
import KMRGeneralCommands from './kmrGeneralCommands'
import KMPController from './kmpController'
import DenseAppBar from './appbarEntity'
import LBRController from './lbrController'

import { Grid } from '@material-ui/core';


class KMR extends Component {
    
  render() {
    return (
      <div style={{background: '#fbfbfb'}}>
        <DenseAppBar />
        <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh'}}>
          <Grid container justify="center" style={{ marginTop: '10px' }}>
            <Grid style={{ marginTop: '15vh', padding: '20px'}}>
              <KMRGeneralCommands/>
            </Grid>
            <Grid style={{ marginTop: '10vh', paddingRight: '20px'}}>
              <KMPController/>
            </Grid>
            <Grid>
              <LBRController/>
            </Grid>
          </Grid>
        </Grid>  
      </div>
      );
  }
}

export default KMR;