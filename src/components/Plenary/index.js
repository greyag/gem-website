import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withAuthorization, AuthUserContext } from '../Session'
import { Table, Button, Form, Modal } from 'react-bootstrap'
import { PLENARY } from '../../constants/plenary'
import { withFirebase } from '../../server/Firebase'
import ZoomLink from '../ZoomLink'
import SlackLink from '../SlackLink'
import VideoLink from '../VideoLink'
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'

const Plenary = (props) => {
  const blocks = Object.keys(PLENARY)
  return (
    <div>
      <h1>Plenary Sessions</h1>
      <h3>{blocks.date}</h3>
      <Table bordered hover size='lg'>
        <tbody>
          {blocks.map((block, ind) => (
            <Block
              block={block}
              firebase={props.firebase}
              key={block}
              ind={ind + 1}
            />
          ))}
        </tbody>
      </Table>
      <a
        href='https://drive.google.com/file/d/1-Z2vYK5VbQTfsSI_4tA3NA84sa8NVsma/view'
        target='_blank'
        rel='noopener noreferrer'
        title='Mental health resources'
      >
        Mental Health Awareness in these troubled times: List of Resources
      </a>
    </div>
  )
}

const Block = ({ block, firebase, ind, ...props }) => {
  const blockObj = PLENARY[block]
  const presentations = blockObj.presentations
    ? Object.keys(blockObj.presentations)
    : []

  const fbPresentations = useTalks('plenary', block, firebase)

  const zooms = useZooms(firebase)

  let body = presentations.map((pres, i) =>
    i === 0 ? (
      <tr key={i}>
        <td rowSpan={presentations.length} width='300px'>
          <strong>{blockObj.date}</strong>
          <br />
          <strong>{blockObj.time + ' EDT or GMT - 4'}</strong>
          <br />
          Hosted by: {blockObj.hosts.join(', ')}
          <br />
          Moderated by: {blockObj.moderators.join(', ')}
          <div>
            <h3 className={'left'}>
              {blockObj.done ? (
                <VideoLink url='/plenary/video' />
              ) : (
                <ZoomLink url={zooms['plen' + ind]} />
              )}
              <SlackLink url={blockObj.slack} />
            </h3>
          </div>
        </td>
        <td>
          <strong>{blockObj.presentations[pres].title}: </strong>{' '}
          {blockObj.presentations[pres].host}
        </td>

        <td>
          <UploadButton
            presentation={blockObj.presentations[pres]}
            block={block}
            firebase={firebase}
          />
        </td>

        <td>
          {fbPresentations[
            blockObj.presentations[pres].title +
              blockObj.presentations[pres].host
          ] && (
            <div>
              <DownloadButton
                url={
                  fbPresentations[
                    blockObj.presentations[pres].title +
                      blockObj.presentations[pres].host
                  ].url
                }
              />
            </div>
          )}
        </td>
      </tr>
    ) : (
      <tr>
        <td>
          <strong>{blockObj.presentations[pres].title}: </strong>{' '}
          {blockObj.presentations[pres].host}
          {blockObj.presentations[pres].title.includes('Mental') && (
            <div>
              <b />
              <a
                href='https://drive.google.com/file/d/1-Z2vYK5VbQTfsSI_4tA3NA84sa8NVsma/view'
                target='_blank'
                rel='noopener noreferrer'
                title='Mental health resources'
              >
                List of Resources
              </a>{' '}
            </div>
          )}
        </td>
        <td>
          {fbPresentations[
            blockObj.presentations[pres].title +
              blockObj.presentations[pres].host
          ] ? (
            <UploadButton
              presentation={
                fbPresentations[
                  blockObj.presentations[pres].title +
                    blockObj.presentations[pres].host
                ]
              }
              block={block}
              firebase={firebase}
            />
          ) : (
            <UploadButton
              presentation={blockObj.presentations[pres]}
              block={block}
              firebase={firebase}
            />
          )}
        </td>
        <td>
          {fbPresentations[
            blockObj.presentations[pres].title +
              blockObj.presentations[pres].host
          ] && (
            <DownloadButton
              url={
                fbPresentations[
                  blockObj.presentations[pres].title +
                    blockObj.presentations[pres].host
                ].url
              }
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
          newTalks[doc.data().title + doc.data().host] = {
            ...doc.data(),
            id: doc.id,
          }
        })
        setTalks(newTalks)
      })
    return unsubscribe
  }, [])

  return talks
}

const useZooms = (firebase) => {
  const [zooms, setZooms] = useState({})
  useEffect(() => {
    let newZooms = {}
    const unsubscribe = firebase.db
      .ref(`/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Zooms/`)
      .on('value', (snapshot) => {
        let data = snapshot.val()
        Object.keys(data).map((room) => {
          newZooms[data[room].room] = data[room]
        })
        setZooms(newZooms)
      })
    return unsubscribe
  }, [firebase])
  return zooms
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
              let id = null
              if (presentation.id) {
                id = presentation.id
              }
              e.preventDefault()
              console.log('Submitted!')
              firebase.postTalk(
                'plenary',
                presentation,
                slides,
                slides.title,
                block
              )
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
