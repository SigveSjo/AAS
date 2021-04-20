import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from './history'

import App from './App'

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/home" component={App} />
                </Switch>
            </Router>
        )
    }
}