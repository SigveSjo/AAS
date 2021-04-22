import { Grid, withStyles, Button } from '@material-ui/core'
import KMRGeneralCommands from './kmr_components/kmrGeneralCommands'
import KMPController from './kmr_components/kmpController'
import LBRController from './kmr_components/lbrController'
import { TextsmsTwoTone } from '@material-ui/icons'

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2,4,3),
      borderRadius: 2,
    }
  })

function RobotComponents(props) {

    const { classes } = props

    const setSrc = (e) => {
        setTimeout(() => {  e.target.src=localStorage.getItem('camera_stream_url_' + props.rid) }, 1500);
    }

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                {
                    // KMR iiwa components
                    props.name === 'KMR' && 
                    <Grid container justify="center" spacing={3}>
                        <Grid item>
                            <KMRGeneralCommands ws={props.ws}/>
                        </Grid>
                        <Grid item>
                            <KMPController ws={props.ws} status={props.state.components.kmp} rid={props.rid}/>
                        </Grid>
                        <Grid item>
                            <LBRController ws={props.ws} status={props.state.components.lbr} rid={props.rid}/>
                        </Grid>
                    </Grid>
                }

                {
                    // (INSERT ROBOT HERE) components
                }
            </Grid>
            <Grid item>
                <Grid>
                    <Button onClick={props.handleCameraEvent}>
                        {props.state.cameraButton}
                    </Button>
                </Grid>
                {
                    (props.state.cameraButton.localeCompare("Stop") == 0) &&
                    <Grid item>
                        <img src={props.state.streamURL || localStorage.getItem('camera_stream_url_' + props.rid)} width="480px" height="360px" onError={(e)=>{setSrc(e)}}/>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}

export default withStyles(styles)(RobotComponents)