import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { withAuthorization } from '../Session'
import { compose } from 'recompose'

//import { compose } from 'recompose'

//import { SignUpLink } from '../SignUp'
//import { withFirebase } from '../../server/Firebase'
import * as ROUTES from '../../constants/routes'
import { GROUPS } from '../../constants/focusGroups'

const FocusGroupsPage = () => (
  <div>
    <h1>Focus Groups</h1>
    {Object.keys(GROUPS).map((group) => (
      <div>
        <Link to={`${ROUTES.FOCUSGROUPS}/${group}`}>{group}</Link>
      </div>
    ))}
  </div>
)
const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(FocusGroupsPage)
