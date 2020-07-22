import React, { Component, useEffect, useState } from 'react'
import { withFirebase } from '../../server/Firebase'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { GROUPS } from '../../constants/splinterGroups'
import { AddTalkModal } from '../AddTalk'
import AllBlocksComponent from './AllBlocksComponent'

const INITIAL_STATE = {
  name: '',
  longName: '',
  hosts: '',
  //blocks: [],
  //blocksAndTalks: {},
  //loading: false,
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

class SplinterGroup extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  async componentDidMount() {
    let myId = this.props.match.params.groupId.toUpperCase()
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
      slack: GROUPS[myId].slack,
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
        <p>Focus Group Leaders: {this.state.hosts}</p>
        <AddTalkModal
          splinterGroup={this.state.name}
          firebase={this.props.firebase}
        />

        <AllBlocksComponent
          //talkObj={this.state.talks}
          removeTalk={this.state.removeTalk}
          moveTalk={this.state.moveTalk}
          splinterGroup={this.state.name}
        />

        <AddTalkModal
          splinterGroup={this.state.name}
          firebase={this.props.firebase}
        />
      </div>
    )
  }
}

const condition = (authUser) => !!authUser

export default compose(
  withFirebase,
  withAuthorization(condition)
)(SplinterGroup)
