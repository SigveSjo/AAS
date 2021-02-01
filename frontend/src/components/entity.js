import React, { useState, useEffect } from 'react'
import { Paper, withStyles, Grid, CardHeader} from '@material-ui/core'
import kmr from '../resources/images/kmriiwa.png'
import { Adjust } from '@material-ui/icons'
import axios from 'axios'
import configs from '../config.json'
import Sarus from '@anephenix/sarus'


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
        axios.get(configs.API_URL + "robots/", { "command" : ""})
            .catch(error => {
                if(error.message == "Network Error"){
                    setStatus("offline")
                }
            })
    });

    const connectionOpened = () => console.log("Socket connection opened");

    const connectionClosed = () => console.log("Socket connection closed");

    const throwError = error => {
        throw error;
    }

    const updateTimeline = event => {
        //const newData = JSON.parse(event.message);
        console.log(event.data)
        //setStatus(event.data["message"])
    }

    const sarus = new Sarus({
        url: configs.WS_URL + "ws/",
        eventListeners: {
            open: [connectionOpened],
            message: [updateTimeline],
            close: [connectionClosed],
            error: [throwError]
        } 
    })

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