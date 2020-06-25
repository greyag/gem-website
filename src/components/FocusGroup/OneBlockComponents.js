import React from 'react'
import { BLOCKS } from '../../constants/blocks'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { Table } from 'react-bootstrap'

const OneBlockComponentHost = ({
  block = '',
  talks = [],
  removeTalk,
  moveTalk,
  blocks,
  focusGroup,
}) => {
  let blockLongName = BLOCKS[block] ? BLOCKS[block].name : 'Unscheduled'

  const RemoveButton = (handleClickFunc) => (
    <button onClick={handleClickFunc}>Remove</button>
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

const OneBlockComponentAttendee = ({ block = '', talks = [], focusGroup }) => {
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

export { OneBlockComponentHost, OneBlockComponentAttendee }
