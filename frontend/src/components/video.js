import { useState } from 'react';
import { Paper, withStyles, Button, IconButton } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'

const styles = theme => ({
    padding: {
        padding: theme.spacing(1),
    },
    loading: {
        padding: theme.spacing(1),
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progress: {
        color: '#f37a00',
    }
  })

function VideoComponent(props) {
    const [loading, setLoading] = useState(false)

    const handleLoad = (e) => {
        setLoading(false)
    }
    
    const setSrc = (e) => {
        //e.target.style.display='none'
        setLoading(true)
        setTimeout(() => { 
            e.target.src=localStorage.getItem('camera_stream_url_' + props.rid)
        }, 1500);
    }
    
    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <Button onClick={props.handleCameraEvent} variant="outlined" color="primary" style={{ textTransform: "none" }}>
                {props.state.cameraButton} video stream
            </Button>
            <IconButton onClick={props.handleCameraIconEvent}>
                <Tooltip title={props.state.cameraIconButton ? "Close video window" : "Open video window"}>
                {
                    props.state.cameraIconButton ?
                    <VideocamOff fontSize="large" color="primary"/>
                    :
                    <Videocam fontSize="large" color="primary"/>
                }
                </Tooltip>
            </IconButton>
            {
                (props.state.cameraButton.localeCompare("Stop") == 0) &&
                [
                    props.state.cameraIconButton &&
                    <div className={classes.container}>
                        {
                            loading &&
                            <div className={classes.loading}>
                                <CircularProgress 
                                    className={classes.progress}
                                    size={120}
                                    thickness={2}
                                    />
                            </div>
                        }
                        <div style={{display: loading ? "none" : "block"}}>
                            <img src={props.state.streamURL || localStorage.getItem('camera_stream_url_' + props.rid)} onError={(e)=>{setSrc(e)}} onLoad={(e)=>{handleLoad(e)}}/>
                        </div>
                    </div>
                ]
            }
            {
            /*
            <Grid container>
                <Grid item>
                    <Button onClick={props.handleCameraEvent}>
                        {props.state.cameraButton}
                    </Button>
                </Grid>
                <Grid item>
                    {
                        (props.state.cameraButton.localeCompare("Stop") == 0) &&
                        <Grid container justify="flex-start" alignItems="flex-start">
                            <Grid item className={classes.loading}>
                                {
                                    loading &&
                                    <CircularProgress 
                                        className={classes.progress}
                                        size={150}
                                        thickness={4}
                                    />
                                }
                            </Grid>
                            <Grid item className={classes.image} justify="flex-start">
                                <img src={props.state.streamURL || localStorage.getItem('camera_stream_url_' + props.rid)} onError={(e)=>{setSrc(e)}} onLoad={()=>{handleLoad()}}/>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
            */
            }
        </Paper>
    )
}

export default withStyles(styles)(VideoComponent)