import React from 'react'
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
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
import AddPosterPage from '../AddPoster'
import Slack from '../Slack'
import Posters, { PostersDay } from '../Posters'
import Discussion from '../Discussion'
import Poster from '../Poster'
import PosterInfo from '../PosterInfo'
import StudentRep from '../StudentRep'
import Video from '../Video'
import StudentVideo from '../StudentDay/StudentVideo'
import PlenaryVideo from '../Plenary/PlenaryVideo'

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
              <Route
                exact
                path={ROUTES.STUDENTSCHEDULE}
                component={StudentDay}
              />
              <Route exact path={'/student/video'} component={StudentVideo} />
              <Route exact path='/student/:repId' component={StudentRep} />
              <Route exact path={'/plenary/video'} component={PlenaryVideo} />
              <Route exact path={ROUTES.PLENARY} component={Plenary} />
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
              <Route exact path='/posters/add' component={AddPosterPage} />
              <Route path='/slack' component={Slack} />
              <Route exact path='/posters' component={Posters} />
              <Route exact path='/posters/day/:dayId' component={PostersDay} />
              <Route exact path='/posters/posterInfo' component={PosterInfo} />
              <Route exact path='/posters/:posterId' component={Poster} />
              <Route exact path={ROUTES.DISCUSSION} component={Discussion} />
              <Route exact path='/videos/:videoId' component={Video} />
            </Switch>
          </div>
        </Router>
      </div>
      <Footer />
    </div>
  </div>
)

export default withAuthentication(App)
