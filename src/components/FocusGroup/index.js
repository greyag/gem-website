import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withFirebase } from '../../server/Firebase'
//import * as ROUTES from '../../constants/routes'
import { GROUPS } from '../../constants/focusGroups'
import { AddTalkLink } from '../AddTalk'
import { DropdownButton, Dropdown } from 'react-bootstrap'

const INITIAL_STATE = {
  name: '',
  longName: '',
  hosts: '',
  blocks: [],
  blocksAndTalks: {},
  loading: false,
}

class FocusGroup extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  async componentDidMount() {
    let myId = this.props.match.params.groupId
    let talks = {}
    try {
      let talks = await this.props.firebase.getBlockTalks(myId, [
        ...GROUPS[myId].blocks,
        'unscheduled',
      ])
      this.setState({
        loading: true,
        name: myId,
        longName: GROUPS[myId].longName,
        hosts: GROUPS[myId].hosts,
        blocks: [...GROUPS[myId].blocks, 'unscheduled'],
        talks: talks,
        removeTalk: (block, talkId) =>
          this.props.firebase.deleteTalk(myId, block, talkId),
        moveTalk: (oldBlock, talkId, newBlock) =>
          this.props.firebase.moveTalk(myId, oldBlock, talkId, newBlock),
      })
    } catch (error) {
      console.error(error)
      this.setState({
        loading: true,
        name: myId,
        longName: GROUPS[myId].longName,
        hosts: GROUPS[myId].hosts,
        blocks: [...GROUPS[myId].blocks, 'unscheduled'],
        talks: talks,
      })
    }
  }

  render() {
    //console.log('state:', this.state)
    return (
      <div>
        <h1>{this.state.name}</h1>
        <h3>{this.state.longName}</h3>
        <p>Hosted by {this.state.hosts}</p>
        {allBlocksComponent(
          this.state.talks,
          this.state.removeTalk,
          this.state.moveTalk
        )}
        <AddTalkLink groupId={this.state.name} />
      </div>
    )
  }
}

const allBlocksComponent = (talkObj = {}, removeTalk, moveTalk) => {
  const blocks = Object.keys(talkObj)
  return (
    <div>
      <h2>Schedule of Talks</h2>
      {blocks.map((block) => (
        <div>
          {oneBlockComponentPublic(
            block,
            talkObj[block],
            removeTalk,
            moveTalk,
            blocks
          )}
        </div>
      ))}
    </div>
  )
}

const oneBlockComponentPublic = (
  block = '',
  talks = [],
  removeTalk,
  moveTalk,
  blocks
) => {
  const RemoveButton = (handleClickFunc) => (
    <button onClick={handleClickFunc}>Remove</button>
  )

  const handleMoveClick = (evt, eventKey) => {
    console.log('event:', evt, eventKey)
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
            onClick={(event) => {
              moveTalk(currentBlock, talkId, event.target.name)
            }}
          >
            {block}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  )
  return (
    <div>
      <h3>{block}</h3>
      <table>
        <tbody>
          <tr>
            <th>Presenter</th>
            <th>Title</th>
            <th></th>
          </tr>
          {talks.length > 0 &&
            talks.map((talk) => {
              //console.log(talk)
              return (
                <tr>
                  <td>{talk.name}</td>
                  <td>{talk.title}</td>
                  {talk.file ? (
                    <td>{<a href={talk.url}>Download</a>}</td>
                  ) : (
                    <td></td>
                  )}
                  <td>{RemoveButton(() => removeTalk(block, talk.id))}</td>
                  <td>
                    {MoveButton(
                      () => handleMoveClick(blocks, block, talk.id),
                      blocks,
                      block,
                      talk.id
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
      {talks.length === 0 && <p>No talks here!</p>}
    </div>
  )
}

const oneBlockComponentSignedIn = (block = '', talks = []) => {
  return (
    <div>
      <h3>{block}</h3>
      <h4>zoom link</h4>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Presenter</th>
          </tr>
          {talks.length > 0 &&
            talks.map((talk) => (
              <tr>
                <td>{talk.title}</td>
                <td>{talk.name}</td>
              </tr>
            ))}

          {!talks.length && <p>No talks here!</p>}
        </tbody>
      </table>
    </div>
  )
}

const oneBlockComponentHost = (block = '', talks = []) => {
  return (
    <div>
      <h3>{block}</h3>
      <h4>zoom link</h4>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Presenter</th>
          </tr>
          {talks.length > 0 &&
            talks.map((talk) => (
              <tr>
                <td>{talk.title}</td>
                <td>{talk.name}</td>
              </tr>
            ))}

          {!talks.length && <p>No talks here!</p>}
        </tbody>
      </table>
    </div>
  )
}

export default compose(withFirebase)(FocusGroup)
