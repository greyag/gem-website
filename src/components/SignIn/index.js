import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

//import { SignUpLink } from '../SignUp'
import { withFirebase } from '../../server/Firebase'
import * as ROUTES from '../../constants/routes'
import { USERNAMES } from './usernames'
import { Form, Button } from 'react-bootstrap'

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>

    <SignInForm />
    <br />
    <p>
      <a
        href='https://gemworkshop.org/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Go to the workshop website to register for the credentials.
      </a>
    </p>

    <p>
      If you are in China, you will need to use a VPN to access this website.
    </p>
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
    const un = USERNAMES[username.toLowerCase()]
      ? USERNAMES[username.toLowerCase()]
      : username + '@gmail.com'
    this.props.firebase
      .doSignInWithEmailAndPassword(un, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.SCHEDULE)
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
    // return (
    //   <Form>
    //     <Form.Group controlId='formBasicEmail'>
    //       <Form.Label>Username</Form.Label>
    //       <Form.Control
    //         type='username'
    //         placeholder='Username'
    //         // value={username}
    //         // onChange={this.onChange}
    //       />
    //     </Form.Group>

    //     <Form.Group controlId='formBasicPassword'>
    //       <Form.Label>Password</Form.Label>
    //       <Form.Control
    //         type='password'
    //         placeholder='Password'
    //         // value={password}
    //         // onChange={this.onChange}
    //       />
    //     </Form.Group>
    //     <Button variant='primary' type='submit'>
    //       Submit
    //     </Button>
    //   </Form>
    // )

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
