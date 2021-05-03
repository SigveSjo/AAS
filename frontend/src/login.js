import { useEffect, useReducer, useState } from 'react'
import { Grid, Paper, withStyles, Button } from "@material-ui/core"
import IconButton from '@material-ui/core/IconButton'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import history from './history'
import title from './resources/images/title.png'
import axios from 'axios'
import configs from './config.json'

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fbfbfb',
        height: '100vh'
    },
    paper: {
        padding: theme.spacing(2),
    },
    textField: {
        margin: theme.spacing(1),
        width: '25ch',
    },
    button: {
        margin: theme.spacing(1),
    }
})

function reducer(state, action) {
    switch (action.type) {
        case 'click':
            return {
                ...state,
                open: true,
                transition: TransitionUp,
                message: action.message
            }
        case 'close':
            return {
                ...state,
                open: false
            }
        default:
            return state
    }
}

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

function Login(props) {
    const [snackState, dispatch] = useReducer(reducer, {
        open: false,
        transition: undefined,
        message: ""
    })
    const [values, setValues] = useState({
        username: '',
        password: '',
        showPassword: false,
    })

    useEffect(() => {
        let username = localStorage.getItem('username')
        let admin = localStorage.getItem('admin')
        let operator = localStorage.getItem('operator')
        if(username !== null && admin !== null && operator !== null){
            history.push('/dashboard')
        }
    }, [])

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handleLoginButtonClicked = () => {
        axios.post(configs.API_URL + "api/login", {
            username: values.username,
            password: values.password
        }).then(resp => {
            let success_msg = "Successfully logged in as " + values.username
            dispatch({type: 'click', message: success_msg})
            localStorage.setItem('username', resp.data.username)
            localStorage.setItem('admin', resp.data.admin)
            localStorage.setItem('operator', resp.data.operator)
            history.push('/dashboard')
        }).catch(error => {
            let fail_msg = "Failed to log in. Wrong password or no user named " + values.username
            dispatch({type: 'click', message: fail_msg})
            console.log(error.response.data)
        })
    }

    const handleSnackClose = () => {
        dispatch({type: 'close'});
    }

    const { classes } = props
    return (
        <div className={classes.root}>
            <Grid container direction='column' justify='center' alignItems='center'>
                <Grid item>
                    <img className={classes.image} src={title} />
                </Grid>
                <Grid item>
                    <Paper className={classes.paper}>
                        <Grid container direction='column' justify='center' alignItems='center'>
                            <Grid item>
                                <FormControl className={classes.textField} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-username"
                                        type={'text'}
                                        value={values.username}
                                        onChange={handleChange('username')}
                                        labelWidth={70}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.textField} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        onChange={handleChange('password')}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                        labelWidth={70}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                            <Button onClick={handleLoginButtonClicked} className={classes.button} variant="outlined" color="primary">
                                Log in
                            </Button>
                            </Grid>
                        </Grid>            
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={snackState.open}
                onClose={handleSnackClose}
                TransitionComponent={snackState.transition}
                message={snackState.message}
                key={snackState.transition ? snackState.transition.name : ''}
            />
        </div>
    )
}

export default withStyles(styles)(Login)