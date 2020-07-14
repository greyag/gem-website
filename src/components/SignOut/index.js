import React from 'react'
import { Button } from 'react-bootstrap'

import { withFirebase } from '../../server/Firebase'

const SignOutButtonBase = ({ firebase }) => (
  <Button variant='light' onClick={firebase.doSignOut}>
    Sign Out
  </Button>
)

export default withFirebase(SignOutButtonBase)
