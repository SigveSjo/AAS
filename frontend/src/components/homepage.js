import React, { Component } from 'react';
import { Paper, withStyles, Grid, TextField, Button } from '@material-ui/core';
import { SportsEsports, ArrowUpwardRounded, ArrowDownwardRounded} from '@material-ui/icons'
import axios from 'axios';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});
const API_URL = "http://127.0.0.1:8000/api/commands/"

var value = ""
var speed = 0.1

class Homepage extends Component {

    handleOnChange = event => {
        value = event.target.value
      };

    handleOnChangeSpeed = event => {
        speed = event.target.value
      };

    buttonClicked(){
        console.log("Command sent!", value)

        axios.post(API_URL, { "command" : value})

        console.log(Date.now());
    }

    moveKMR(){

        var direction = "up"
        var vector = null

        console.log("FIRE")

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
            vector = " 0 0 1"
        }
        if(direction === "counter-clockwise"){
            vector = " 0 0 -1"
        }
        
        axios.post(API_URL, { "command" : "kmr:" + speed + vector})

    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <SportsEsports />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField onChange={this.handleOnChange} id="kmr" type="string" fullWidth autoFocus/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button onClick={this.buttonClicked} variant="outlined" color="primary" style={{ textTransform: "none" }}>Send</Button>
                    </Grid>
                </div>
                <div className={classes.margin}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item>
                            <SportsEsports />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField onChange={this.handleOnChangeSpeed} id="speed" type="string" fullWidth autoFocus/>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button onClick={this.moveKMR()} variant="outlined" color="primary" style={{ textTransform: "none" }}><ArrowUpwardRounded /></Button>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Homepage)