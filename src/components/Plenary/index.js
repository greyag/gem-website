import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withAuthorization, AuthUserContext } from '../Session'
import { Table, Button, Form, Modal } from 'react-bootstrap'
import { PLENARY } from '../../constants/plenary'
import { withFirebase } from '../../server/Firebase'
import * as ROLES from '../../constants/roles'
import { ROOMS } from '../../constants/rooms'
import ZoomLink from '../ZoomLink'
import SlackLink from '../SlackLink'
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'

const Plenary = (props) => {
  const blocks = Object.keys(PLENARY)

  return (
    <div>
      <AuthUserContext.Consumer>
        {(authUser) => {
          let isHost = authUser && authUser.roles.HOST === ROLES.HOST
          return (
            <div>
              <h1>Plenary Sessions</h1>
              <h3>{blocks.date}</h3>
              <Table bordered hover size='lg'>
                <tbody>
                  {blocks.map((block) => (
                    <Block
                      block={block}
                      isHost={isHost}
                      firebase={props.firebase}
                      key={block}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )
        }}
      </AuthUserContext.Consumer>
    </div>
  )
}

const Block = ({ block, isHost, firebase, ...props }) => {
  const blockObj = PLENARY[block]
  const presentations = blockObj.presentations
    ? Object.keys(blockObj.presentations)
    : []

  const fbPresentations = useTalks('plenary', block, firebase)
  console.log(fbPresentations)

  let body = presentations.map((pres, i) =>
    i === 0 ? (
      <tr key={i}>
        <td rowspan={presentations.length}>
          <strong>{blockObj.date}</strong>
          <br />
          <strong>{blockObj.time + ' ET'}</strong>
          <br />
          Hosted by: {blockObj.hosts.join(', ')}
          <br />
          Moderated by: {blockObj.moderators.join(', ')}
          <div>
            <ZoomLink url={ROOMS.room1} />
            <SlackLink url={blockObj.slack} />
          </div>
        </td>
        <td>
          <strong>{blockObj.presentations[pres].title}: </strong>{' '}
          {blockObj.presentations[pres].host}
        </td>
        {isHost && (
          <td>
            <UploadButton
              presentation={blockObj.presentations[pres]}
              block={block}
              firebase={firebase}
            />
          </td>
        )}
        <td>
          {fbPresentations[blockObj.presentations[pres].title] && (
            <DownloadButton
              url={fbPresentations[blockObj.presentations[pres].title].url}
            />
          )}
        </td>
      </tr>
    ) : (
      <tr>
        <td>
          <strong>{blockObj.presentations[pres].title}: </strong>{' '}
          {blockObj.presentations[pres].host}
        </td>
        {/* if is host, have upload */}
        {isHost && (
          <td>
            <UploadButton
              presentation={blockObj.presentations[pres]}
              block={block}
              firebase={firebase}
            />
          </td>
        )}
        <td>
          {fbPresentations[blockObj.presentations[pres].title] && (
            <DownloadButton
              url={fbPresentations[blockObj.presentations[pres].title].url}
            />
          )}
        </td>
      </tr>
    )
  )
  return body
}
const useTalks = (splinterGroup, block, firebase) => {
  const [talks, setTalks] = useState({})
  useEffect(() => {
    const unsubscribe = firebase.fs
      .collection(`focusGroups/${splinterGroup}/blocks/${block}/talks`)
      .onSnapshot((snapshot) => {
        const newTalks = {}
        snapshot.docs.forEach((doc) => {
          newTalks[doc.data().title] = { ...doc.data(), id: doc.id }
        })
        setTalks(newTalks)
      })
    return unsubscribe
  }, [])

  return talks
}

const DownloadButton = ({ url, ...props }) => {
  return (
    <a
      href={url}
      download
      target='_blank'
      rel='noopener noreferrer'
      title='Download'
    >
      {<AiOutlineCloudDownload size='30' />}
    </a>
  )
}

const UploadButton = ({ presentation, firebase, block, ...props }) => {
  const [showModal, setShowModal] = useState(false)
  const [slides, setSlides] = useState(null)
  const [verify, setVerify] = useState(false)
  const handleToggle = () => setShowModal(!showModal)
  return (
    <div>
      <AiOutlineCloudUpload
        size='30'
        onClick={() => handleToggle()}
        title='Upload'
      />
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
            Upload Poster Files
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Submitted!')
              firebase.postTalk(presentation, slides, slides.title, block)
              setShowModal(false)
            }}
          >
            <Form.Group controlId='verify'>
              <Form.Check
                id='verify'
                type='checkbox'
                checked={verify}
                onChange={() => setVerify(!verify)}
                label={`I confirm that I am ${presentation.host}.`}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='posterFile'
                label='Please upload your presentation. This will allow everyone to access and download this file'
                onChange={(e) => setSlides(e.target.files[0])}
              />
            </Form.Group>
            You can reupload your files at any time. The files you had
            previously uploaded will be overwritten.
            <br />
            <br />
            <Button
              variant='primary'
              type='submit'
              disabled={!(verify && !!slides)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withFirebase, withAuthorization(condition))(Plenary)
