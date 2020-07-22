import React from 'react'
import { withAuthorization } from '../Session'
import Video from '../Video'

const condition = (authUser) => !!authUser

const PlenaryVideo = ({ ...props }) => {
  let vidIds = ['plen1']

  return (
    <div>
      <h1>Plenary Presentations</h1>
      {vidIds.map((vidId) => (
        <Video videoId={vidId} key={vidId} />
      ))}
    </div>
  )
}

export default withAuthorization(condition)(PlenaryVideo)
