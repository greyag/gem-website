import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import SignOutButton from '../SignOut'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = ({ authUser }) => (
  <ul>
    {/* <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li> */}
    <li>
      <Link to={ROUTES.SCHEDULE}>Schedule</Link>
    </li>
    <li>
      <Link to={ROUTES.FOCUSGROUPS}>Focus Groups</Link>
    </li>
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN}>Admin </Link>
      </li>
    )}
    <li>
      <SignOutButton />
    </li>
  </ul>
)

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
    {/* <li>
      <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </li> */}
    {/* <li>`
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li> */}
    <li>
      <Link to={ROUTES.SCHEDULE}>Schedule</Link>
    </li>
    <li>
      <Link to={ROUTES.FOCUSGROUPS}>Focus Groups</Link>
    </li>
  </ul>
)

export default Navigation
