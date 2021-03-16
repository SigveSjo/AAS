// App.js
import { useState, useEffect } from 'react';
import KMRGeneralCommands from './kmr_components/kmrGeneralCommands'
import KMPController from './kmr_components/kmpController'
import DenseAppBar from './appbarEntity'
import LBRController from './kmr_components/lbrController'
import { Grid } from '@material-ui/core'

function KMR(props) {
  const [kmp, setKmp] = useState(props.kmp) 
  const [lbr, setLbr] = useState(props.lbr)

  useEffect(() => {
    console.log("Hello girl!")
  })

  return (
    <div style={{background: '#fbfbfb', position: 'fixed'}}>
      <DenseAppBar />
      <Grid container direction="column" justify="center" alignItems="center" style={{ minHeight: '100vh'}}>
        <Grid container justify="center" style={{ marginTop: '10px' }}>
          <Grid style={{ marginTop: '15vh', padding: '20px'}}>
            <KMRGeneralCommands/>
          </Grid>
          <Grid style={{ marginTop: '10vh', paddingRight: '20px'}}>
            <KMPController status={kmp}/>
          </Grid>
          <Grid>
            <LBRController status={lbr}/>
          </Grid>
        </Grid>
      </Grid>  
    </div>
    )
}

export default KMR;