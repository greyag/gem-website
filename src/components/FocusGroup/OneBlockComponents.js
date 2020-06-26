import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { BLOCKS } from '../../constants/blocks'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Table, Modal, Button } from 'react-bootstrap'

let OneBlockComponentHost = ({
  block = '',
  removeTalk,
  moveTalk,
  blocks,
  focusGroup,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false)
  const [talks, setTalks] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = props.firebase.fs
      .collection(`focusGroups/${focusGroup}/blocks/${block}/talks`)
      .onSnapshot(
        (snapshot) => {
          let talks = []
          snapshot.forEach(async (doc) => {
            let url = doc.data().file
              ? await this.downloadTalkLink(doc.data().file)
              : ''
            talks.push({ ...doc.data(), id: doc.id, url })
          })
          setLoading(false)
          setTalks(talks)
        },
        (err) => {
          setError(err)
        }
      )

    return () => unsubscribe()
  })

  const handleToggle = () => setShowModal(!showModal)

  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled'

  const RemoveButton = (handleClickFunc) => (
    <div>
      <Button onClick={() => handleToggle()} handleClickFunc={handleClickFunc}>
        Remove
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
            Are you sure you want to delete this?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This deletes the talk permanently from the database. You should only
            do this if it's a repeat or if the presenter made a mistake and will
            reupload their talk.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleToggle()}>No, I don't want to</Button>
          <Button
            onClick={() => {
              handleClickFunc()
              handleToggle()
            }}
          >
            Yes, delete this talk
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )

  const handleMoveClick = (evt, eventKey) => {
    moveTalk(evt['currentBlock'], evt['talkId'], evt['newBlock'])
  }

  const MoveButton = (
    handleSelect = () => {},
    blocks = [],
    currentBlock = '',
    talkId = ''
  ) => (
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
    ? BLOCKS[block]['rooms'][findIndex(BLOCKS[block].groups, focusGroup)]
    : undefined

  console.log(talks)

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
            talks.map((talk, ind) => {
              return (
                <tr key={ind}>
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                  {talk.file ? (
                    <td>{<a href={talk.url}>Download</a>}</td>
                  ) : (
                    <td> </td>
                  )}
                  <td>
                    {MoveButton(
                      () => handleMoveClick(blocks, block, talk.id),
                      blocks,
                      block,
                      talk.id
                    )}
                  </td>
                  <td>
                    {block === 'unscheduled' &&
                      RemoveButton(() => removeTalk(block, talk.id))}
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

let OneBlockComponentAttendee = ({ block = '', talks = [], focusGroup }) => {
  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled'

  let zoomLink = BLOCKS[block]
    ? BLOCKS[block]['rooms'][(findIndex(BLOCKS[block].groups), focusGroup)]
    : undefined

  return (
    <div>
      <h3>{blockLongName}</h3>
      <h4>{BLOCKS[block] && BLOCKS[block].time}</h4>
      <h6>{zoomLink && <a href={`${zoomLink}`}>Zoom Link</a>}</h6>
      <table>
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
      </table>
      {talks.length === 0 && <p>No talks here!</p>}
    </div>
  )
}

const findIndex = (groupsArr, focusGroup) => {
  let index = groupsArr.reduce((accum, curr, ind) => {
    if (curr === focusGroup) {
      return ind
    } else if (typeof curr !== 'string') {
      if (curr.indexOf(focusGroup) > -1) return ind
    } else {
      return accum
    }
  }, -1)
  return index
}

OneBlockComponentHost = compose(withFirebase)(OneBlockComponentHost)
OneBlockComponentAttendee = compose(withFirebase)(OneBlockComponentAttendee)

export { OneBlockComponentHost, OneBlockComponentAttendee }
