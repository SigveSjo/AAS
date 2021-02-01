import React, { useState } from 'react';
import { Paper, withStyles, Grid, Button, Slider } from '@material-ui/core';
import { ArrowUpwardRounded, ArrowDownwardRounded, ArrowBack, ArrowForward, RotateLeft, RotateRight} from '@material-ui/icons'
import axios from 'axios';
import configs from '../config.json'

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});
const API_URL = configs.API_URL + "commands/"

function KMPController(props) {

    const [speed, setSpeed] = useState(0.1)

    const handleOnChangeSpeed = (event, newValue) => {
        setSpeed(newValue)
      };

    const moveKMP = (direction) => {
        var vector = null

        if(direction === "up"){
            vector = " 1 0 0"
        }
        if(direction === "down"){
            vector = " -1 0 0"
        }
        if(direction === "left"){
            vector = " 0 1 0"
        }
        if(direction === "right"){
            vector = " 0 -1 0"
        }
        if(direction === "clockwise"){
            vector = " 0 0 -1"
        }
        if(direction === "counter-clockwise"){
            vector = " 0 0 1"
        }
        if(direction === "stop"){
            vector = " 0 0 0"
        }
        
        axios.post(API_URL, { "command" : "kmp:" + speed + vector})
    }

     
    const { classes } = props;

    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <div> KMP Controller </div>
            </Grid>
            <div className={classes.margin}>
                Speed <Slider
                defaultValue={0.1}
                step={0.1}
                min={0.0}
                max={1.0}
                marks
                valueLabelDisplay="auto"
                onChange={handleOnChangeSpeed}
                />
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('up')} variant="outlined" color="primary" style={{ textTransform: "none" }}><ArrowUpwardRounded /></Button>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Grid>
                        <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('left')} variant="outlined" color="primary" style={{ textTransform: "none" }}><ArrowBack /></Button>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('down')} variant="outlined" color="primary" style={{ textTransform: "none" }}><ArrowDownwardRounded /></Button>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('right')} variant="outlined" color="primary" style={{ textTransform: "none" }}><ArrowForward/></Button>
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Grid>
                        <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('counter-clockwise')} variant="outlined" color="primary" style={{ textTransform: "none" }}><RotateLeft /></Button>
                    </Grid>
                    <Grid>
                        <Button onMouseUp ={() => moveKMP('stop')} onMouseDown ={() => moveKMP('clockwise')} variant="outlined" color="primary" style={{ textTransform: "none" }}><RotateRight /></Button>
                    </Grid>
                </Grid>
            </div>
        </Paper>
    );
    
}

export default withStyles(styles)(KMPController)