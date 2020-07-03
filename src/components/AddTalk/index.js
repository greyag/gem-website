import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'
import * as ROUTES from '../../constants/routes'
import * as ROLES from '../../constants/roles'
import { Button } from 'react-bootstrap'

const INITIAL_STATE = {
  groupId: '',
  name: '',
  title: '',
  error: null,
  selectedFile: null,
  postTalk: () => {},
}

class AddTalkForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({
      groupId: this.props.match.params.groupId,
      postTalk: this.props.firebase.postTalk,
    })
  }

  onSubmit = (event) => {
    console.log('submit!')
    const { name, title, groupId, selectedFile } = this.state
    this.props.firebase.postTalk(groupId, { name, title }, selectedFile)
    this.props.history.push(`/focusgroups/${this.state.groupId}`)
    event.preventDefault()
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    })
  }

  render() {
    const { name, title, groupId, error } = this.state

    const isInvalid = title === '' || name === ''

    console.log('state', this.state)
    return (
      <div>
        <h3>Add a new {groupId} talk</h3>
        <form onSubmit={this.onSubmit}>
          <input
            name='name'
            value={name}
            onChange={this.onChange}
            type='text'
            placeholder='Full Name'
          />
          <input
            name='title'
            value={title}
            onChange={this.onChange}
            type='text'
            placeholder='title'
          />
          <input
            name='selectedFile'
            onChange={this.onFileChange}
            type='file'
            ref={this.state.fileInput}
            placeholder='Your slides'
          />
          <button disabled={isInvalid} type='submit'>
            Submit talk
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

const AddTalkLink = ({ groupId }) => {
  return (
    <Link to={{ pathname: `/focusgroups/${groupId}/add` }}>
      <Button type='button' variant='success'>
        Add a talk!
      </Button>
    </Link>
  )
}

const condition = (authUser) => !!authUser

const AddTalkPage = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(AddTalkForm)

export default AddTalkPage
export { AddTalkLink, AddTalkForm }
