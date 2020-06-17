import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

//import { SignUpLink } from '../SignUp'
import { withFirebase } from '../../server/Firebase'
import * as ROUTES from '../../constants/routes'
import { USERNAMES } from './usernames'

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    {/* <SignUpLink />  */}
  </div>
)

const INITIAL_STATE = {
  username: '',
  password: '',
  error: null,
}

class SignInFormBase extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onSubmit = (event) => {
    const { username, password } = this.state
    this.props.firebase
      .doSignInWithEmailAndPassword(USERNAMES[username.toLowerCase()], password)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      .catch((error) => {
        this.setState({ error })
      })

    event.preventDefault()
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { username, password, error } = this.state

    const isInvalid = password === '' || username === ''

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name='username'
          value={username}
          onChange={this.onChange}
          type='text'
          placeholder='Username'
        />
        <input
          name='password'
          value={password}
          onChange={this.onChange}
          type='password'
          placeholder='Password'
        />
        <button disabled={isInvalid} type='submit'>
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase)

export default SignInPage

export { SignInForm }
