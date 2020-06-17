import React, { Component } from 'react'
import { compose } from 'recompose'
//import * as ROLES from '../../constants/roles'
//import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'

class SchedulePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      days: {},
    }
  }

  // componentDidMount() {
  //   this.setState({ loading: true })
  //   this.props.firebase.days().('value', (snapshot) => {
  //     const daysObject = snapshot.val()
  //     // const usersList = Object.keys(usersObject).map((key) => ({
  //     //   ...usersObject[key],
  //     //   uid: key,
  //     // }))
  //     console.log(daysObject)
  //     this.setState({
  //       days: daysObject,
  //       loading: false,
  //     })
  //   })
  // }

  // componentWillUnmount() {
  //   //this.props.firebase.days()
  // }

  render() {
    const { loading } = this.state
    return (
      <div>
        <h1>Schedule</h1>
        <p>Tschser.</p>
        {loading && <div>Loading...</div>}
        {/* <UserList users={users} /> */}
      </div>
    )
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
)

//const condition = (authUser) => !!authUser.roles[ROLES.ADMIN]

export default compose(withFirebase)(SchedulePage)
