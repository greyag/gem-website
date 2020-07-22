import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

import { withFirebase } from '../../server/Firebase'

import DownloadButton from '../DownloadButton'
import { withAuthorization } from '../Session'

const useRep = (repId, firebase) => {
  const [rep, setRep] = useState({})
  useEffect(() => {
    const unsubscribe = firebase.fs
      .doc(`/election/${repId}`)
      .onSnapshot((doc) => {
        setRep({ ...doc.data() })
      })

    return unsubscribe
  }, [])
  return rep
}

const useRepDB = (repId, firebase) => {
  const [rep, setRep] = useState([])
  useEffect(() => {
    let newRep = {}
    const unsubscribe = firebase.db
      .ref(
        `/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/StudentElection/${repId}`
      )
      .on('value', (snapshot) => {
        newRep = snapshot.val()
        //newPoster = Object.keys(posters).map((posterId) => posters[posterId])
        // snapshot.docs.map((doc) => {
        //   newPosters[doc.id] = { ...doc.data()}
        // })
        setRep(newRep)
      })
    return unsubscribe
  }, [firebase, repId])
  return rep
}

const StudentRep = (props) => {
  let repId = props.match.params.repId
  let rep = useRep(repId, props.firebase)
  let repDB = useRepDB(repId, props.firebase)

  if (!rep.name) {
    rep = repDB
  }
  return (
    <div>
      <h3 className={'left'}>{rep.name}</h3>
      <p>{rep.bio && rep.bio}</p>
      {rep.pdfURL && (
        <div>
          <object
            className='center'
            data={rep.pdfURL}
            height='900px'
            width='100%'
            aria-label='Poster'
          ></object>
          <DownloadButton url={rep.pdfURL} /> PDF
        </div>
      )}
      {rep.url && (
        <div>
          <video src={rep.url} height='500px' width='100%' controls />
          <DownloadButton url={rep.url} /> Video
        </div>
      )}
    </div>
  )
}
const condition = (authUser) => !!authUser

export default compose(
  withFirebase,
  withRouter,
  withAuthorization(condition)
)(StudentRep)
