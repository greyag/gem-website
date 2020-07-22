import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../server/Firebase'
import { withAuthorization } from '../Session'
import { compose } from 'recompose'

const useVideoDB = (videoId, firebase) => {
  const [poster, setPoster] = useState({})
  useEffect(() => {
    let newPoster = {}
    const unsubscribe = firebase.db
      .ref(
        `/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/KalturaVideos/${videoId}`
      )
      .on('value', (snapshot) => {
        newPoster = snapshot.val()
        //newPoster = Object.keys(posters).map((posterId) => posters[posterId])
        // snapshot.docs.map((doc) => {
        //   newPosters[doc.id] = { ...doc.data()}
        // })
        setPoster(newPoster)
      })
    return unsubscribe
  }, [firebase, videoId])
  return poster
}

const Video = ({ videoId, ...props }) => {
  videoId = videoId ? videoId : props.match.params.videoId
  let videoDB = useVideoDB(videoId, props.firebase)
  console.log(videoDB)

  return (
    <div>
      <h3 className={'left'}>
        <a
          href={videoDB.url}
          target='_blank'
          rel='noopener noreferrer'
          title='Link to Video Source'
        >
          {videoDB.title}
        </a>
      </h3>
      <div>
        <iframe
          id='kaltura_player'
          src={videoDB.src}
          width='100%'
          height='750px'
          allowfullscreen
          webkitallowfullscreen
          mozAllowFullScreen
          allow='autoplay *; fullscreen *; encrypted-media *'
          sandbox='allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation'
          frameborder='0'
          title='Kaltura Player'
        ></iframe>
      </div>
    </div>
  )
}
//

//'http://cdnapi.kaltura.com/p/{partnerId}/sp/{partnerId}00/embedIframeJs/uiconf_id/{uiConfId}/partner_id/{partnerId}/entry_id/{entryId}/playerId/{playerId}?autoembed=true&width={width}&height={height}'

const condition = (authUser) => !!authUser

export default compose(withFirebase, withAuthorization(condition))(Video)
