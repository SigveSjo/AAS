import React, { useState } from 'react';
import { Paper, withStyles, Grid, Button, Slider } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons'
import axios from 'axios';
import lbr_image from '../resources/images/lbr.png'
import configs from '../config.json'

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    },
    lbr: {
        margin: theme.spacing(1.5)
    }
});
const API_URL = configs.API_URL + "commands/"

function LBRController(props) {

    const moveLBR = (joint, direction) => {
        axios.post(API_URL, { "command" : "lbr:" + joint + " " + direction})
    }
     
    const { classes } = props;

    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <div> LBR Controller </div>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '10px' }}>
                <Grid className={classes.lbr}>
                    <img src={lbr_image} />
                </Grid>
                <Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A7','0')} onMouseDown ={() => moveLBR('A7',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A7','0')} onMouseDown ={() => moveLBR('A7',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A6','0')} onMouseDown ={() => moveLBR('A6',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A6','0')} onMouseDown ={() => moveLBR('A6',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A5','0')} onMouseDown ={() => moveLBR('A5',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A5','0')} onMouseDown ={() => moveLBR('A5',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A4','0')} onMouseDown ={() => moveLBR('A4',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A4','0')} onMouseDown ={() => moveLBR('A4',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A3','0')} onMouseDown ={() => moveLBR('A3',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A3','0')} onMouseDown ={() => moveLBR('A3',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                         <Button onMouseUp ={() => moveLBR('A2','0')} onMouseDown ={() => moveLBR('A2',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A2','0')} onMouseDown ={() => moveLBR('A2',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveLBR('A1','0')} onMouseDown ={() => moveLBR('A1',"-1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Remove /></Button>
                        <Button onMouseUp ={() => moveLBR('A1','0')} onMouseDown ={() => moveLBR('A1',"1")} variant="outlined" color="primary" style={{ textTransform: "none" }}><Add /></Button>
                        <hr/>
                    </Grid>
                    <Grid container justify="center">
                        <Button onClick = {() => moveLBR('A9', '1')} variant="outlined" color="primary" style={{ textTransform: "none" }}>Drive</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
    
}

export default withStyles(styles)(LBRController)