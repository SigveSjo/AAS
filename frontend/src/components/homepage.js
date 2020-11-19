import React, { useState } from 'react'
import { Paper, withStyles, Grid, TextField, Button } from '@material-ui/core'
import { SportsEsports} from '@material-ui/icons'
import axios from 'axios'

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});
const API_URL = "http://127.0.0.1:8000/api/commands/"


function Homepage(props) {
    const [value, setValue] = useState("")

    const handleOnChange = (event) => {
        setValue(event.target.value)
    }

    const buttonClicked = () =>{
        console.log("Command sent", value)

        axios.post(API_URL, { "command" : value})

        console.log(Date.now());
    }

    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <SportsEsports />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField onChange={handleOnChange} id="kmr" type="string" fullWidth autoFocus/>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="space-between">
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button onClick={buttonClicked} variant="outlined" color="primary" style={{ textTransform: "none" }}>Send</Button>
                </Grid>
            </div>
        </Paper>
    )
}

export default withStyles(styles)(Homepage)