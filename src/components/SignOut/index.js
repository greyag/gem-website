import React from 'react'

import { withFirebase } from '../../server/Firebase'

const SignOutButtonBase = ({ firebase }) => (
  <button type='button' onClick={firebase.doSignOut}>
    Sign Out
  </button>
)

export default withFirebase(SignOutButtonBase)
