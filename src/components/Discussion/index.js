import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withAuthorization, AuthUserContext } from '../Session'
//import * as ROLES from '../../constants/roles'
import { discussionHosts } from './hosts'
import { decedal } from './decedal'
import { withFirebase } from '../../server/Firebase'
// import { Table, Button, Form, Modal } from 'react-bootstrap'
import SlackLink from '../SlackLink'
import ZoomLink from '../ZoomLink'
import * as ROLES from '../../constants/roles'
import OneBlockComponent from '../SplinterGroup/OneBlockComponents'
import { AddTalkModal } from '../AddTalk'

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

const Discussion = (props) => {
  let zooms = useZooms(props.firebase)
  return (
    <div>
      <h1>Decadal Future and beyond!</h1>
      <h4>
        <div>
          {decedal.date}, {decedal.time}
        </div>
      </h4>
      <h4>
        <ZoomLink url={zooms[decedal.room]} /> <SlackLink url={decedal.slack} />
      </h4>
      <p>
        As the community prepares for the next Solar and Space Physics Decadal
        Survey and strategic planning that goes beyond the next decade, it’s a
        good time to start a discussion on the current understanding of
        Geospace, remaining gaps, and challenges, as well as needs for future
        investigations. More information about this session will be posted on
        the{' '}
        <a
          href='https://gem.epss.ucla.edu/mediawiki/index.php/2020_Virtual-GEM_Workshop'
          target='_blank'
          rel='noopener noreferrer'
          title='GEM Wiki'
        >
          {' '}
          GEM Wiki.{' '}
        </a>
      </p>
      <p>
        Please contact us with any comments or suggestions you have on topics to
        discuss or other ideas about this brainstorming session and its
        implementation:
      </p>
      <ul>
        {discussionHosts.map((host, ind) => (
          <li key={ind}>{host}</li>
        ))}
      </ul>
      <AuthUserContext.Consumer>
        {(authUser) => {
          let isHost = authUser && authUser.roles.HOST === ROLES.HOST
          return (
            <OneBlockComponent
              block={'unscheduled'}
              splinterGroup={'Decadal'}
              isHost={isHost}
              removeTalk={(talkId) =>
                props.firebase.deleteTalk('Decadal', 'unscheduled', talkId)
              }
              allowMove={false}
              isFocusGroup={false}
            />
          )
        }}
      </AuthUserContext.Consumer>
      <AddTalkModal splinterGroup={'Decadal'} firebase={props.firebase} />
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition), withFirebase)(Discussion)
