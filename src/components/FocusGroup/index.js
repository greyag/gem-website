import React, { Component } from 'react'
import { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { GROUPS } from '../../constants/focusGroups'
import { AddTalkLink } from '../AddTalk'
import AllBlocksComponent from './AllBlocksComponent'

const INITIAL_STATE = {
  name: '',
  longName: '',
  hosts: '',
  //blocks: [],
  //blocksAndTalks: {},
  //loading: false,
}

class FocusGroup extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  async componentDidMount() {
    let myId = this.props.match.params.groupId
    //let talks = {}
    // try {
    //   let talks = await this.props.firebase.getBlockTalks(myId, [
    //     ...GROUPS[myId].blocks,
    //     'unscheduled',
    //   ])
    this.setState({
      //loading: true,
      name: myId,
      longName: GROUPS[myId].longName,
      hosts: GROUPS[myId].hosts,
      //blocks: [...GROUPS[myId].blocks, 'unscheduled'],
      //talks: talks,
      removeTalk: (block, talkId) =>
        this.props.firebase.deleteTalk(myId, block, talkId),
      moveTalk: (oldBlock, talkId, newBlock) =>
        this.props.firebase.moveTalk(myId, oldBlock, talkId, newBlock),
      //   })
      // } catch (error) {
      //   console.error(error)
      //   this.setState({
      //     loading: true,
      //     name: myId,
      //     longName: GROUPS[myId].longName,
      //     hosts: GROUPS[myId].hosts,
      //     blocks: [...GROUPS[myId].blocks, 'unscheduled'],
      //     talks: talks,
      //   })
    })
  }

  render() {
    return (
      <div>
        <h1>{this.state.longName}</h1>
        <p>Hosted by {this.state.hosts}</p>

        <AllBlocksComponent
          //talkObj={this.state.talks}
          removeTalk={this.state.removeTalk}
          moveTalk={this.state.moveTalk}
          focusGroup={this.state.name}
        />

        <AddTalkLink groupId={this.state.name} />
      </div>
    )
  }
}

const condition = (authUser) => !!authUser

export default compose(withFirebase, withAuthorization(condition))(FocusGroup)
