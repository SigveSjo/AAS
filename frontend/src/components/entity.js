import React, { useState, useEffect } from 'react'
import { Paper, withStyles, Grid, CardHeader} from '@material-ui/core'
import kmr from '../resources/images/kmriiwa.png'
import { Adjust } from '@material-ui/icons'
import axios from 'axios'
import configs from '../config.json'


const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});



function Entity(props) {

    const [status, setStatus] = useState("online")

    useEffect(() => {
        // TODO: implement fetching of KMR status
        axios.post(configs.API_URL, { "command" : ""})
            .catch(error => {
                if(error.message == "Network Error"){
                    setStatus("offline")
                }
            })
    });

    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <h1> KMR iiwa #1 </h1>
            </Grid>
            <div>
                <img src={kmr} />
            </div>
            <Grid container justify="center" style={{ marginTop: '10px' }}>
                <Grid>
                    <h3> Status: <div color="secondary"> {status} </div> </h3>
                </Grid>
            </Grid>
            
        </Paper>
    )
}

export default withStyles(styles)(Entity)