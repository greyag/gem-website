import React from 'react'
import { withAuthorization } from '../Session'
import Video from '../Video'

const condition = (authUser) => !!authUser

const StudentVideo = ({ ...props }) => {
  let vidIds = ['stu1', 'stu2', 'stu3', 'stu4']

  return (
    <div>
      <h1>Student Day Presentations</h1>
      {vidIds.map((vidId) => (
        <Video videoId={vidId} key={vidId} />
      ))}
    </div>
  )
}

export default withAuthorization(condition)(StudentVideo)
