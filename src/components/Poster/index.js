import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

import { withFirebase } from '../../server/Firebase'
import DownloadButton from '../DownloadButton'
import { withAuthorization } from '../Session'

const usePoster = (posterId, firebase) => {
  const [poster, setPoster] = useState({})
  useEffect(() => {
    const unsubscribe = firebase.fs
      .doc(`/posters/${posterId}`)
      .onSnapshot((doc) => {
        setPoster({ ...doc.data() })
      })

    return unsubscribe
  }, [posterId, firebase])
  return poster
}

const usePosterDB = (posterId, firebase) => {
  const [poster, setPoster] = useState([])
  useEffect(() => {
    let newPoster = {}
    const unsubscribe = firebase.db
      .ref(`/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Schedule/${posterId}`)
      .on('value', (snapshot) => {
        newPoster = snapshot.val()
        //newPoster = Object.keys(posters).map((posterId) => posters[posterId])
        // snapshot.docs.map((doc) => {
        //   newPosters[doc.id] = { ...doc.data()}
        // })
        setPoster(newPoster)
      })
    return unsubscribe
  }, [firebase, posterId])
  return poster
}

const Poster = (props, section = 'all') => {
  let posterId = props.match.params.posterId
  let poster = usePoster(posterId, props.firebase)
  let posterDB = usePosterDB(posterId, props.firebase)

  if (!poster.title) {
    poster = posterDB
    console.log(poster)
  }
  return (
    <div>
      <h3 className={'left'}>{poster.title}</h3>
      <h4 className={'left'}>
        {poster.firstName} {poster.lastName}
      </h4>
      {poster.posterUrl && (
        <div>
          <object
            className='center'
            data={poster.posterUrl}
            height='600px'
            width='100%'
            aria-label='Poster'
          ></object>
          <DownloadButton url={poster.posterUrl} /> Poster
        </div>
      )}
      <br />
      {poster.mediaURL && (
        <div>
          <video src={poster.mediaURL} height='500px' width='100%' controls />
          <DownloadButton url={poster.mediaURL} /> Video
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
)(Poster)
