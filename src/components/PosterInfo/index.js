import React from 'react'
import { withAuthorization } from '../Session'
import { compose } from 'recompose'

const PosterInfo = (props) => {
  return (
    <div>
      <h1>Poster Session Information</h1>
      <p>
        Running poster sessions in a virtual meeting is particularly challenging
        because posters are by definition an in-person interaction. Recognizing
        that poster presentations have always been an important part of the GEM
        workshops, the GEM steering committee decided to go ahead and run poster
        sessions during VGEM 2020. Here are some clear points of how we envision
        the poster sessions.
      </p>
      <ul>
        <li>Each session will run for two hours.</li>
        <li>
          We have created eight Zoom rooms for each poster session (Tuesday and
          Thursday).
        </li>
        <li>
          In each Zoom room 6-7 posters will be presented while a host and a
          moderator will be responsible for the session.
        </li>
        <li>
          The posters presented in each Zoom room will belong in the same
          research area.
        </li>
        <li>
          Attendees are free to come and go into any of the eight Zoom rooms as
          they wish.
        </li>
        <li>
          The presenters will have uploaded their posters, preferably in PDF
          format, on the VGEM site using the functionality provided in{' '}
          <a href='https://www.vgem2020.com/posters'>vgem2020.com/posters</a>.
          This will allow attendees the opportunity to have a first look at
          their posters before the session starts.
        </li>
        <li>
          Optionally, the presenters can additionally upload a video where they
          will narrate their poster - The presenters should be prepared to
          present a “lightning” version of their poster but also a longer one (5
          - 10 min).
        </li>
        <li>
          Depending on the number of people visiting the particular Zoom room,
          the host of the session will decide how the presentations will
          proceed.
        </li>
        <li>
          Additionally, “Breakout” Zoom rooms can be set up by the room/session
          host, where participants and presenters can continue their discussion
          in a separate session. Participants and/or presenters can ask the host
          for a breakout room at any time. They can rejoin the main Zoom room
          when they have finished their side discussions.
        </li>
      </ul>
      <p>
        We hope that this will allow for GEM style poster sessions where
        constructive discussion will take place and in particular where our
        students and young scientists will be able to present their work and get
        valuable feedback.
      </p>
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(PosterInfo)
