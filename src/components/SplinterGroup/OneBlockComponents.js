import React, { useState, useEffect } from 'react'
import Firebase, { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { BLOCKS } from '../../constants/blocks'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Table, Modal, Button, Form } from 'react-bootstrap'
import { GROUPS } from '../../constants/splinterGroups'
import ZoomLink from '../ZoomLink'
import SlackLink from '../SlackLink'
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'
import * as ROUTES from '../../constants/routes'

const useTalks = (splinterGroup, block, firebase) => {
  const [talks, setTalks] = useState([])
  useEffect(() => {
    const unsubscribe = firebase.fs
      .collection(`focusGroups/${splinterGroup}/blocks/${block}/talks`)
      .orderBy('moveTime')
      .onSnapshot((snapshot) => {
        const newTalks = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
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

//const uploadSlides = () => {}

let OneBlockComponent = ({
  block = '',
  removeTalk = () => {},
  moveTalk = () => {},
  blocks = [],
  splinterGroup = '',
  isHost = false,
  allowMove = true,
  isFocusGroup = true,
  ...props
}) => {
  let talks = useTalks(splinterGroup, block, props.firebase)
  console.log('talks:', talks)
  // props.firebase.talksHaveMoveTime(talks, splinterGroup, block)

  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled Talks'

  const handleCompleteClick = (talk) => {
    props.firebase.setCompleted(splinterGroup, block, talk.id, !talk.done)
  }

  const RemoveButton = ({ talk }) => {
    const [showModal, setShowModal] = useState(false)
    const handleToggle = () => setShowModal(!showModal)
    return (
      <div>
        <Button onClick={() => handleToggle()}>Remove</Button>
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
              Are you sure you want to delete this?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              This deletes the talk permanently from the database. You should
              only do this if it's a repeat or if the presenter made a mistake
              and will reupload their talk.
            </p>
            <p>
              Selected talk is {talk.title} by {talk.name}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                handleToggle()
              }}
            >
              No, I don't want to
            </Button>
            <Button
              onClick={() => {
                removeTalk(talk.id)
                handleToggle()
              }}
            >
              Yes, delete this talk
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  const MoveButton = (blocks = [], currentBlock = '', talkId = '') => (
    <DropdownButton title='Move Talk'>
      {blocks
        .filter((block) => block !== currentBlock)
        .map((block) => (
          <Dropdown.Item
            as='button'
            name={block}
            key={block}
            onClick={(event) => {
              moveTalk(currentBlock, talkId, event.target.name)
            }}
          >
            {BLOCKS[block] ? BLOCKS[block].name : 'unscheduled'}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  )
  let roomInd = BLOCKS[block] && BLOCKS[block].groups.indexOf(splinterGroup)
  let partner

  let isJoint = roomInd === -1
  if (isJoint) {
    roomInd = BLOCKS[block].groups.findIndex((elem) => typeof elem !== 'string')
    partner = BLOCKS[block].groups[roomInd].filter(
      (elem) => elem !== splinterGroup
    )[0]
  }

  let zoomRoom = BLOCKS[block] ? BLOCKS[block]['rooms'][roomInd] : undefined

  let zooms = useZooms(props.firebase)
  console.log(zooms)
  return (
    <div>
      <h3>{isFocusGroup && blockLongName}</h3>
      <h4>
        {isJoint && 'JOINT SESSION with '}
        {isJoint && (
          <a href={`${ROUTES.FOCUSGROUPS}/${partner}`}>
            {GROUPS[partner].longName}
          </a>
        )}
      </h4>
      <h4>{BLOCKS[block] && BLOCKS[block].time + ' EDT or GMT - 4'}</h4>
      <h6>
        {zoomRoom && <ZoomLink url={zooms[zoomRoom]} />}
        {BLOCKS[block] && <SlackLink url={GROUPS[splinterGroup].slack} />}
      </h6>

      <Table>
        <thead>
          <tr>
            {isHost && <th>Done</th>}
            <th>Presenter</th>
            <th>Title</th>
            <th></th>
            <th></th>
            {isHost && allowMove && <th></th>}
            {block === 'unscheduled' && <th></th>}
          </tr>
        </thead>
        <tbody>
          {talks.length > 0 &&
            talks.map((talk) => {
              return (
                <tr
                  key={talk.id}
                  className={talk.done ? 'bg-secondary' : undefined}
                >
                  {isHost && (
                    <td>
                      <input
                        type='checkbox'
                        id='done'
                        name='done'
                        checked={talk.done}
                        onChange={() => handleCompleteClick(talk)}
                      ></input>
                    </td>
                  )}
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                  <td>
                    <UploadButton
                      splinterGroup={splinterGroup}
                      firebase={props.firebase}
                      block={block}
                      talk={talk}
                      title='Upload'
                    />
                  </td>
                  {(isHost || talk.isPublic) && talk.url ? (
                    <td>
                      {
                        <a
                          href={talk.url}
                          download
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {<AiOutlineCloudDownload size='30' />}
                        </a>
                      }
                    </td>
                  ) : (
                    isHost && <td></td>
                  )}

                  {isHost && <td>{MoveButton(blocks, block, talk.id)}</td>}
                  {isHost && (
                    <td>
                      {block === 'unscheduled' && <RemoveButton talk={talk} />}
                    </td>
                  )}
                </tr>
              )
            })}
        </tbody>
      </Table>
      {talks.length === 0 && <p>No talks here!</p>}
    </div>
  )
}
const UploadButton = ({ splinterGroup, firebase, block, talk, ...props }) => {
  const [showModal, setShowModal] = useState(false)
  const [slides, setSlides] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
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
              firebase.postTalk(
                splinterGroup,
                { ...talk, isPublic },
                slides,
                talk.id,
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
                label={`I confirm that I am ${talk.name}.`}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                id='posterFile'
                label='Please upload your presentation.'
                onChange={(e) => setSlides(e.target.files[0])}
              />
            </Form.Group>
            You can reupload your files at any time. The files you had
            previously uploaded will be overwritten.
            <br />
            <Form.Group>
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

OneBlockComponent = compose(withFirebase)(OneBlockComponent)

export default OneBlockComponent
