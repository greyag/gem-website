import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navigation from '../Navigation'
import LandingPage from '../Landing'
import SignInPage from '../SignIn'
import SignUpPage from '../SignUp'
import HomePage from '../Home'
import AdminPage from '../Admin'
import Schedule from '../Schedule'
import FocusGroups from '../FocusGroups'
import FocusGroup from '../FocusGroup'
import AddTalkPage from '../AddTalk'
import * as ROUTES from '../../constants/routes'
import { withAuthentication } from '../Session'

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Switch>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SCHEDULE} component={Schedule} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route exact path={ROUTES.FOCUSGROUPS} component={FocusGroups} />
        <Route exact path='/focusgroups/:groupId' component={FocusGroup} />
        <Route exact path='/focusgroups/:groupId/add' component={AddTalkPage} />
      </Switch>
    </div>
  </Router>
)

export default withAuthentication(App)
