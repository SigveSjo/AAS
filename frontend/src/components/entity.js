import React, { useState} from 'react'
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

    var kmpStatus = false;
    var lbrStatus = false; 

    const [status, setStatus] = useState("offline");

    axios.get(configs.API_URL + "robots/1").then(resp => {
        kmpStatus = resp.data.kmp; 
        lbrStatus = resp.data.lbr;
        
        if(resp.data.name == "KMR" && (kmpStatus|| lbrStatus)){
            setStatus("online")
        }
    });

    const connectionOpened = () => console.log("Socket connection opened");

    const connectionClosed = () => console.log("Socket connection closed");

    const throwError = error => {
        throw error;
    }

    const updateTimeline = event => {
        //const newData = JSON.parse(event.message);
        
        const object = JSON.parse(event.data)
        console.log(object)

        if(object.robot == "KMR"){
            if(object.component == "kmp"){
                kmpStatus = object.component_status; 
            }
            if(object.component == "lbr"){
                lbrStatus = object.component_status; 
            }
        }

        if(kmpStatus || lbrStatus){
            setStatus("online")
        }
        else{
            setStatus("offline")
        }
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