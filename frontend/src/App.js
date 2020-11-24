// App.js
import React, { Component } from 'react';
import DenseAppBar from './components/appbar'
import Entity from './components/entity'
import { Grid, Button } from '@material-ui/core';
import history from './history'


class App extends Component {

  render() {
    return (
            <div style={{background: '#fbfbfb'}}>
            <DenseAppBar />
              <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Button onClick={() => history.push('/kmr')} ><Entity /></Button>
              </Grid>  
            </div>
      );
  }
}

export default App;