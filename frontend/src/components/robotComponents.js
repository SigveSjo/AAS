import { useState } from 'react';
import { Grid, withStyles, Button, Grow } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import KMRGeneralCommands from './kmr_components/kmrGeneralCommands'
import KMPController from './kmr_components/kmpController'
import LBRController from './kmr_components/lbrController'

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: theme.spacing(2,4,3),
      borderRadius: 2,
    },
    loading: {
        position: 'absolute',
    },
    imageLoading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        color: '#f37a00',
    }
  })

function RobotComponents(props) {
    const [loading, setLoading] = useState(false)

    const handleLoad = (e) => {
        setLoading(false)
    }

    const setSrc = (e) => {
        setLoading(true)
        setTimeout(() => { 
            e.target.src=localStorage.getItem('camera_stream_url_' + props.rid)
        }, 1500);
    }
    
    const { classes } = props
    return (
        <Grid container className={classes.root} spacing={3}>
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
                    <Grid> 
                        <div className={classes.imageLoading}>
                            {
                                loading &&
                                <div className={classes.loading}>
                                    <CircularProgress 
                                        className={classes.progress}
                                        size={100}
                                        thickness={4}
                                    />
                                </div>
                            }
                            <div className={classes.image}>
                                <img src={props.state.streamURL || localStorage.getItem('camera_stream_url_' + props.rid)} width="200px" height="200px" onError={(e)=>{setSrc(e)}} onLoad={()=>{handleLoad()}}/>
                            </div>
                        </div>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
}

export default withStyles(styles)(RobotComponents)