import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'
import { Button } from 'react-bootstrap'

const INITIAL_STATE = {
  name: '',
  title: '',
  error: null,
  selectedPoster: null,
  selectedMedia: null,
  postPoster: () => {},
}

class AddPosterForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({
      postPoster: this.props.firebase.postPoster,
    })
  }

  onSubmit = (event) => {
    console.log('submit!')
    const { name, title, selectedPoster, selectedMedia } = this.state
    this.props.firebase.postPoster(
      { name, title },
      selectedPoster,
      selectedMedia
    )
    this.props.history.push(`/posters/`)
    event.preventDefault()
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  onFileChange = (event) => {
    this.setState({
      [event.target.name]: event.target.files[0],
    })
  }

  render() {
    const { name, title, selectedPoster, selectedMedia, error } = this.state

    const isInvalid = title === '' || name === '' || selectedPoster === null

    console.log('state', this.state)
    return (
      <div>
        <h3>Upload your Poster!</h3>
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
            name='selectedPoster'
            onChange={this.onFileChange}
            type='file'
            ref={selectedPoster}
            placeholder='Your Poster'
          />
          <input
            name='selectedMedia'
            onChange={this.onFileChange}
            type='file'
            ref={selectedMedia}
            placeholder='Your Video'
          />
          <button disabled={isInvalid} type='submit'>
            Upload Poster
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

const AddPosterLink = () => {
  return (
    <Link to={{ pathname: `/posters/add` }}>
      <Button type='button' variant='success'>
        Upload your Poster
      </Button>
    </Link>
  )
}

const condition = (authUser) => !!authUser

const AddPosterPage = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(AddPosterForm)

export default AddPosterPage
export { AddPosterLink, AddPosterForm }
