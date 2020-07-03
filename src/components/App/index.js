import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navigation from '../Navigation'
//import LandingPage from '../Landing'
import SignInPage from '../SignIn'
import SignUpPage from '../SignUp'
//import HomePage from '../Home'
//import AdminPage from '../Admin'
import Schedule from '../Schedule'
import SplinterGroups from '../SplinterGroups'
import SplinterGroup from '../SplinterGroup'
import AddTalkPage from '../AddTalk'
import * as ROUTES from '../../constants/routes'
import { withAuthentication } from '../Session'
import Footer from '../Footer'
import Header from '../Header'
import StudentDay from '../StudentDay'
import Plenary from '../Plenary'

const App = () => (
  <div className='body'>
    <div className='myContainer'>
      <Header />
      <div className='content'>
        <Router>
          <div>
            <Navigation />
            <Switch>
              <Route exact path={ROUTES.LANDING} component={Schedule} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SCHEDULE} component={Schedule} />
              <Route path={ROUTES.STUDENTSCHEDULE} component={StudentDay} />
              <Route path={ROUTES.PLENARY} component={Plenary} />
              {/* <Route path={ROUTES.HOME} component={HomePage} /> */}
              {/* <Route path={ROUTES.ADMIN} component={AdminPage} /> */}
              <Route
                exact
                path={ROUTES.FOCUSGROUPS}
                component={SplinterGroups}
              />
              <Route
                exact
                path='/focusgroups/:groupId'
                component={SplinterGroup}
              />
              <Route
                exact
                path='/focusgroups/:groupId/add'
                component={AddTalkPage}
              />
            </Switch>
          </div>
        </Router>
      </div>
      <Footer />
    </div>
  </div>
)

export default withAuthentication(App)
