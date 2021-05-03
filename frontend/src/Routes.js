import React, { Component } from "react"
import { Router, Switch, Route } from "react-router-dom"
import history from './history'

import Login from './login'
import App from './App'

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/dashboard" component={App} />
                </Switch>
            </Router>
        )
    }
}