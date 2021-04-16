import React, { useEffect, useCallback, useState} from 'react'
import { Paper, withStyles, Grid} from '@material-ui/core'
import kmr from '../resources/images/kmriiwa.png'
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
})

function Entity(props) {
    const [status, setStatus] = useState("offline");

    const fetch = useCallback((rid) => {
        axios.get(configs.API_URL + "api/robots/" + rid).then(resp => {
            setEntityStatus(resp.data.components)
        })
    }, [])

    const setEntityStatus = useCallback((components) => {
        const statuses = Object.values(components)
        if(statuses.includes(true)){
            setStatus("online")
            return
        }
        setStatus("offline")
    }, [])

    useEffect(() => {
        setEntityStatus(props.components)
        try{
            props.ws.on('status', data => {
                const object = JSON.parse(data)
                if(object.rid === props.rid){
                    fetch(object.rid)
                }
            })
        } catch (e){
            console.log("Websocket is not connected!")
        }
    }, [props.ws])

    
    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <h2> {props.name} (RID: {props.rid}) </h2>
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