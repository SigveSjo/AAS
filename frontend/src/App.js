// App.js
import React, { Component } from 'react';
import Homepage from './components/homepage'
import KMPController from './components/kmpController'

import { Grid } from '@material-ui/core';

class App extends Component {
  state = {
    todos: []
  };
/* 
   This is where the magic happens
   async componentDidMount() {
     try {
       const res = await fetch('http://127.0.0.1:8000/api/'); // fetching the data from api, before the page loaded
       const todos = await res.json();
       this.setState({
         todos
        });
      } catch (e) {
        console.log(e);
      }
    }
    */
    
  render() {
    return (
      <div>
        
        <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh' }}>
          <Grid>
            <></>
          </Grid>
          <Grid>
            <Homepage/>
          </Grid>
          <Grid>
            <div> <hr/> </div>
          </Grid>
          <Grid>
            <KMPController/>
          </Grid>
        </Grid>  
      </div>
      );
  }
}

export default App;