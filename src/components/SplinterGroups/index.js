import React from 'react'
import { Link } from 'react-router-dom'
import { withAuthorization } from '../Session'
import { compose } from 'recompose'

//import { compose } from 'recompose'

//import { SignUpLink } from '../SignUp'
//import { withFirebase } from '../../server/Firebase'
import * as ROUTES from '../../constants/routes'
import { GROUPS } from '../../constants/splinterGroups'
import SlackLink from '../SlackLink'

const FocusGroupsPage = () => (
  <div>
    <h1>Focus Groups</h1>
    {Object.keys(GROUPS).map((group) => (
      <div key={group}>
        <Link to={`${ROUTES.FOCUSGROUPS}/${group}`}>
          {GROUPS[group].longName}
        </Link>
        <SlackLink url={GROUPS[group].slack} />
      </div>
    ))}
  </div>
)
const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(FocusGroupsPage)
