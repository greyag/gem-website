import React, { useState, useEffect, Component } from 'react'
import { compose } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'
import { Button, Form, Modal } from 'react-bootstrap'

const INITIAL_STATE = {
  groupId: '',
  name: '',
  title: '',
  error: null,
  selectedFile: null,
  postTalk: () => {},
}

const AddTalkModal = ({
  splinterGroup,
  block = 'unscheduled',
  firebase,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [slides, setSlides] = useState(null)
  const handleToggle = () => setShowModal(!showModal)

  //console.log(title, name)

  return (
    <div>
      <Button type='button' variant='success' onClick={() => handleToggle()}>
        Add a talk!
      </Button>
      <Modal
        show={showModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop={true}
        onHide={handleToggle}
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            Add a {splinterGroup} Talk
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              firebase.postTalk(
                splinterGroup,
                { name, title, isPublic },
                slides
              )
              e.preventDefault()
              console.log('Submitted!')
              // firebase.uploadPoster(posterFile, poster.posterId, poster, true)
              // videoFile &&
              //   firebase.uploadPoster(
              //     videoFile,
              //     researchArea,
              //     poster.posterId,
              //     poster,
              //     false
              // const { name, title, groupId, selectedFile } = this.state
              // this.props.firebase.postTalk(
              //   groupId,
              //   { name, title },
              //   selectedFile
              setShowModal(false)
            }}
          >
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Your Title'
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder='Your Name'
                type='text'
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='slidesFile'
                label='Please upload your presentation.'
                onChange={(e) => setSlides(e.target.files[0])}
              />
            </Form.Group>
            <Form.Text className='text-muted'>
              You can reupload your files at any time. The files you had
              previously uploaded will be overwritten.
            </Form.Text>

            <br />
            <Form.Group controlId='public'>
              <Form.Check
                id='public'
                type='checkbox'
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                label={`I wish to allow all attendees to this workshop access to my presentation. If unchecked, it will be made available to hosts only.`}
              />
            </Form.Group>
            <br />
            <Button
              variant='primary'
              type='submit'
              disabled={!(title.length && name.length)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
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
export { AddTalkLink, AddTalkForm, AddTalkModal }
