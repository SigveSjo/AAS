import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from './history'

import App from './App'
import KMR from "./components/kmr"

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/home" component={App} />
                    <Route path="/kmr" component={KMR} />
                </Switch>
            </Router>
        )
    }
}