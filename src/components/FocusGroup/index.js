import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withFirebase } from '../../server/Firebase'
//import * as ROUTES from '../../constants/routes'
import { GROUPS } from '../../constants/focusGroups'
import { AddTalkLink } from '../AddTalk'

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

  componentDidMount() {
    let myId = this.props.match.params.groupId
    this.setState({
      loading: true,
      name: myId,
      longName: GROUPS[myId].longName,
      hosts: GROUPS[myId].hosts,
      blocks: [...GROUPS[myId].blocks, 'unscheduled'],
      talks: this.props.firebase.getBlockTalks(myId, [
        ...GROUPS[myId].blocks,
        'unscheduled',
      ]),
    })
  }

  render() {
    //console.log('state:', this.state)

    return (
      <div>
        <h1>{this.state.name}</h1>
        <h3>{this.state.longName}</h3>
        <p>Hosted by {this.state.hosts}</p>
        {allBlocksComponent(this.state.talks)}
        <AddTalkLink groupId={this.state.name} />
      </div>
    )
  }
}

const allBlocksComponent = (talkObj = {}) => {
  const times = Object.keys(talkObj)

  return (
    <div>
      <h2>Schedule of Talks</h2>
      {times.map((time) => (
        <div>{oneBlockComponentPublic(time, talkObj[time])}</div>
      ))}
    </div>
  )
}

const oneBlockComponentPublic = (block = '', talks = []) => {
  console.log(block, talks)
  return (
    <div>
      <h3>{block}</h3>
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
