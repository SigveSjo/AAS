import React, { Component } from 'react';
import { Paper, withStyles, Grid, TextField, Button } from '@material-ui/core';
import { SportsEsports} from '@material-ui/icons'
import axios from 'axios';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});

var value = ""

class Homepage extends Component {

    handleOnChange = event => {
        value = event.target.value
      };

    buttonClicked(){
        console.log("Im clicked XD ", value)

        axios.post("http://127.0.0.1:8000/api/commands/", { "command" : value})
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
            </Paper>
        );
    }
}

export default withStyles(styles)(Homepage)