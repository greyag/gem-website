import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { BLOCKS } from '../../constants/blocks'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Table, Modal, Button } from 'react-bootstrap'
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

//const uploadSlides = () => {}

let OneBlockComponentHost = ({
  block = '',
  removeTalk,
  moveTalk,
  blocks,
  splinterGroup,
  ...props
}) => {
  let talks = useTalks(splinterGroup, block, props.firebase)

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
    console.log('groups:', BLOCKS[block].groups)
    roomInd = BLOCKS[block].groups.findIndex((elem) => typeof elem !== 'string')
    partner = BLOCKS[block].groups[roomInd].filter(
      (elem) => elem !== splinterGroup
    )[0]
  }

  let zoomLink = BLOCKS[block] ? BLOCKS[block]['rooms'][roomInd] : undefined
  return (
    <div>
      <h3>{blockLongName}</h3>
      <h4>
        {isJoint && 'JOINT SESSION with '}
        {isJoint && (
          <a href={`${ROUTES.FOCUSGROUPS}/${partner}`}>
            {GROUPS[partner].longName}
          </a>
        )}
      </h4>
      <h4>{BLOCKS[block] && BLOCKS[block].time + ' ET'}</h4>
      <h6>
        {zoomLink && <ZoomLink url={zoomLink} />}
        {BLOCKS[block] && <SlackLink url={GROUPS[splinterGroup].slack} />}
      </h6>

      <Table>
        <thead>
          <tr>
            <th>Done</th>
            <th>Presenter</th>
            <th>Title</th>
            <th></th>
            <th></th>
            {block === 'unscheduled' && <th></th>}
          </tr>
        </thead>
        <tbody>
          {talks.length > 0 &&
            talks.map((talk) => {
              return (
                <tr key={talk.id} className={talk.done && 'bg-secondary'}>
                  <td>
                    <input
                      type='checkbox'
                      id='done'
                      name='done'
                      checked={talk.done}
                      onClick={() => handleCompleteClick(talk)}
                    ></input>
                  </td>
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                  <td> </td>
                  {talk.file ? (
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
                    <td> </td>
                  )}

                  <td>{MoveButton(blocks, block, talk.id)}</td>
                  <td>
                    {block === 'unscheduled' && <RemoveButton talk={talk} />}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </Table>
      {talks.length === 0 && <p>No talks here!</p>}
    </div>
  )
}

let OneBlockComponentAttendee = ({ block = '', splinterGroup, ...props }) => {
  const talks = useTalks(splinterGroup, block, props.firebase)

  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled Talks'

  let roomInd =
    BLOCKS[block] &&
    BLOCKS[block].groups.findIndex((elem) => elem === splinterGroup)
  let partner

  let isJoint = roomInd === -1
  if (isJoint) {
    roomInd = BLOCKS[block].groups.findIndex((elem) => typeof elem !== 'string')
    partner = BLOCKS[block].groups[roomInd].filter(
      (elem) => elem !== splinterGroup
    )[0]
  }

  let zoomLink = BLOCKS[block] ? BLOCKS[block]['rooms'][roomInd] : undefined

  return (
    <div>
      <h3>{blockLongName}</h3>
      <h4>
        {isJoint && 'JOINT SESSION with '}
        {isJoint && (
          <a href={`${ROUTES.FOCUSGROUPS}/${partner}`}>
            {GROUPS[partner].longName}
          </a>
        )}
      </h4>
      <h4>{BLOCKS[block] && BLOCKS[block].time + ' ET'}</h4>
      <h6>
        {zoomLink && <ZoomLink url={zoomLink} />}
        {BLOCKS[block] && <SlackLink url={GROUPS[splinterGroup].slack} />}
      </h6>
      <Table>
        <tbody>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
          </tr>
          {talks.length > 0 &&
            talks.map((talk, ind) => {
              return (
                <tr key={talk.id} className={talk.done && 'bg-secondary'}>
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
      {talks.length === 0 && <p>No talks here!</p>}
    </div>
  )
}

OneBlockComponentHost = compose(withFirebase)(OneBlockComponentHost)
OneBlockComponentAttendee = compose(withFirebase)(OneBlockComponentAttendee)

export { OneBlockComponentHost, OneBlockComponentAttendee }
