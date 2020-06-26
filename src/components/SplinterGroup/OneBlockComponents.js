import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { BLOCKS } from '../../constants/blocks'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Table, Modal, Button } from 'react-bootstrap'

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

let OneBlockComponentHost = ({
  block = '',
  removeTalk,
  moveTalk,
  blocks,
  splinterGroup,
  ...props
}) => {
  let talks = useTalks(splinterGroup, block, props.firebase)

  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled'

  const handleCompleteClick = (talk) => {}

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
  let zoomLink = BLOCKS[block]
    ? BLOCKS[block]['rooms'][findIndex(BLOCKS[block].groups, splinterGroup)]
    : undefined

  return (
    <div>
      <h3>{blockLongName}</h3>
      <h4>{BLOCKS[block] && BLOCKS[block].time}</h4>
      <h6>{zoomLink && <a href={`${zoomLink}`}>Zoom Link</a>}</h6>
      <Table>
        <thead>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {talks.length > 0 &&
            talks.map((talk) => {
              return (
                <tr key={talk.id}>
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                  {talk.file ? (
                    <td>
                      {
                        <a href={talk.url} download>
                          Download
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

  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled'

  let zoomLink = BLOCKS[block]
    ? BLOCKS[block]['rooms'][(findIndex(BLOCKS[block].groups), splinterGroup)]
    : undefined

  return (
    <div>
      <h3>{blockLongName}</h3>
      <h4>{BLOCKS[block] && BLOCKS[block].time}</h4>
      <h6>{zoomLink && <a href={`${zoomLink}`}>Zoom Link</a>}</h6>
      <Table>
        <tbody>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
          </tr>
          {talks.length > 0 &&
            talks.map((talk, ind) => {
              return (
                <tr key={ind}>
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

const findIndex = (groupsArr, splinterGroup) => {
  let index = groupsArr.reduce((accum, curr, ind) => {
    if (curr === splinterGroup) {
      return ind
    } else if (typeof curr !== 'string') {
      if (curr.indexOf(splinterGroup) > -1) return ind
    } else {
      return accum
    }
  }, -1)
  return index
}

OneBlockComponentHost = compose(withFirebase)(OneBlockComponentHost)
OneBlockComponentAttendee = compose(withFirebase)(OneBlockComponentAttendee)

export { OneBlockComponentHost, OneBlockComponentAttendee }
