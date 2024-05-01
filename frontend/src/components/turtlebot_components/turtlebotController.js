import { useState, useEffect } from 'react'
import { Paper, withStyles, Grid, Button, Slider } from '@material-ui/core'
import { ArrowUpwardRounded, ArrowDownwardRounded, ArrowBack, ArrowForward, RotateLeft, RotateRight} from '@material-ui/icons'

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
})

function TurtleBotController(props) {
    const [speed, setSpeed] = useState(0.1)
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('operator') === 'true'){
            setEnabled(props.status)
        }
    })

    const handleOnChangeSpeed = (event, newValue) => {
        setSpeed(newValue)
    }

    const moveTurtleBot = (direction) => {
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
        
        props.ws.emit('command', { "command" : "turtlebot:" + speed + vector, 'rid': props.rid})
    }
    const defaultColor = "white"
    const pressColor = "gray"

    const [upColor, setUpColor] = useState(defaultColor)
    const [downColor, setDownColor] = useState(defaultColor)
    const [leftColor, setLeftColor] = useState(defaultColor)
    const [rightColor, setRightColor] = useState(defaultColor)
    const [counterClockwiseColor, setCounterClockwiseColor] = useState(defaultColor)
    const [clockwiseColor, setClockwiseColor] = useState(defaultColor)

    document.onkeydown = function(event) {
        if (localStorage.getItem('operator') === 'true' && enabled) {
            if (event.key == 'ArrowUp' && upColor==defaultColor) {
                moveTurtleBot("up")
                console.log("ArrowUp pressed")
                setUpColor(pressColor)
            }
            if (event.key == 'ArrowDown' && downColor==defaultColor) {
                moveTurtleBot("down")
                console.log("ArrowDown pressed")
                setDownColor(pressColor)
            }
            if (event.key == 'ArrowLeft' && leftColor==defaultColor) {
                moveTurtleBot("left")
                console.log("ArrowLeft pressed")
                setLeftColor(pressColor)
            }
            if (event.key == 'ArrowRight' && rightColor==defaultColor) {
                moveTurtleBot("right")
                console.log("ArrowRight pressed")
                setRightColor(pressColor)
            }
            if (event.key == 'o' && counterClockwiseColor==defaultColor) {
                moveTurtleBot("counter-clockwise")
                console.log("CounterClockwise pressed")
                setCounterClockwiseColor(pressColor)
            }
            if (event.key == 'p' && clockwiseColor==defaultColor) {
                moveTurtleBot("clockwise")
                console.log("clockwise pressed")
                setClockwiseColor(pressColor)
            }
        }
    }

    document.onkeyup = function(event) {
        if (localStorage.getItem('operator') === 'true' && enabled) {
            if (event.key == 'ArrowUp') {
                moveTurtleBot("stop")
                console.log("ArrowUp released")
                setUpColor(defaultColor)
            }
            if (event.key == 'ArrowDown') {
                moveTurtleBot("stop")
                console.log("ArrowDown released")
                setDownColor(defaultColor)
            }
            if (event.key == 'ArrowLeft') {
                moveTurtleBot("stop")
                console.log("ArrowLeft released")
                setLeftColor(defaultColor)
            }
            if (event.key == 'ArrowRight') {
                moveTurtleBot("stop")
                console.log("ArrowRight released")
                setRightColor(defaultColor)
            }
            if (event.key == 'o') {
                moveTurtleBot("stop")
                console.log("CounterClockwise released")
                setCounterClockwiseColor(defaultColor)
            }
            if (event.key == 'p') {
                moveTurtleBot("stop")
                console.log("clockwise released")
                setClockwiseColor(defaultColor)
            }
        }
    }

    const { classes } = props
    return (
        <Paper className={classes.padding}>
            <Grid container justify="center">
                <div> TurtleBot Controller </div>
            </Grid>
            <div className={classes.margin} >
                Speed <Slider
                defaultValue={0.13}
                step={0.01}
                min={0.0}
                max={0.26}
                marks
                valueLabelDisplay="auto"
                onChange={handleOnChangeSpeed}
                disabled={!enabled} 
                />
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('up')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: upColor}}><ArrowUpwardRounded /></Button>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Grid>
                        <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('left')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: leftColor}}><ArrowBack /></Button>
                    </Grid>
                    <Grid>
                        <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('down')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: downColor}}><ArrowDownwardRounded /></Button>
                    </Grid>
                    <Grid>
                        <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('right')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: rightColor}}><ArrowForward/></Button>
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Grid>
                        <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('counter-clockwise')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: counterClockwiseColor}}><RotateLeft /></Button>
                    </Grid>
                    <Grid>
                        <Button disabled={!enabled} onMouseUp ={() => moveTurtleBot('stop')} onMouseDown ={() => moveTurtleBot('clockwise')} variant="outlined" color="primary" style={{ textTransform: "none", backgroundColor: clockwiseColor}}><RotateRight /></Button>
                    </Grid>
                </Grid>
            </div>
        </Paper>
    )
    
}

export default withStyles(styles)(TurtleBotController)