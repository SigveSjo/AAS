import React, { useEffect, useState} from 'react'
import { Paper, withStyles, Grid} from '@material-ui/core'
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
    },
    image: {
        flex: 1,
        width: 200,
        height: 200,
        resizeMode: "contain",
    }
});

function Entity(props) {

    const [status, setStatus] = useState("offline");

    useEffect(() => {
        /*
        axios.get(configs.API_URL + "robots/1").then(resp => {
            if(resp.data.name == "KMR" && (resp.data.kmp || resp.data.lbr)){
                setStatus("online")
            }
            else{
                setStatus("offline")
            }
        });
        */
    })

    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <h2> KMR iiwa {props.num} </h2>
            </Grid>
            <div>
                <img className={classes.image} src={kmr} />
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