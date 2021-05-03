import React, { useState, useEffect } from 'react'
import { Paper, withStyles, Grid, TextField, Button } from '@material-ui/core'
import { SportsEsports} from '@material-ui/icons'
import axios from 'axios'
import configs from '../../config.json'

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});

const API_URL = configs.API_URL + "commands/"


function KMRGeneralCommands(props) {
    const [value, setValue] = useState("")
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('operator') === 'true'){
            setEnabled(true)
        }
    })

    const handleOnChange = (event) => {
        setValue(event.target.value)
    }

    const buttonClicked = () =>{
        console.log("Command sent", value)

        //axios.post(API_URL, { "command" : value})
        props.ws.emit('command', { "command" : value })

        console.log(Date.now());
    }

    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <div className={classes.margin}>
                <Grid container justify="center">
                    <div> KMR General Commands </div>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <SportsEsports />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField onChange={handleOnChange} id="kmr" type="string" fullWidth autoFocus label="KMR iiwa command" disabled={!enabled}/>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="space-between">
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button onClick={buttonClicked} variant="outlined" color="primary" disabled={!enabled} style={{ textTransform: "none" }}>Send</Button>
                </Grid>
            </div>
        </Paper>
    )
}

export default withStyles(styles)(KMRGeneralCommands)