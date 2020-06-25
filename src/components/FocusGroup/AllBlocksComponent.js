import React from 'react'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'
import {
  OneBlockComponentHost,
  OneBlockComponentAttendee,
} from './OneBlockComponents'

const AllBlocksComponent = ({
  talkObj = {},
  removeTalk,
  moveTalk,
  focusGroup,
}) => {
  const blocks = Object.keys(talkObj)
  return (
    <div>
      <h2>Schedule of Talks</h2>
      {blocks.map((block) => {
        return (
          <div key={block}>
            <AuthUserContext.Consumer>
              {(authUser) => {
                //console.log(authUser)
                return authUser && authUser.roles.HOST === ROLES.HOST ? (
                  <OneBlockComponentHost
                    block={block}
                    talks={talkObj[block]}
                    removeTalk={removeTalk}
                    moveTalk={moveTalk}
                    blocks={blocks}
                    focusGroup={focusGroup}
                  />
                ) : (
                  <OneBlockComponentAttendee
                    block={block}
                    talks={talkObj[block]}
                    focusGroup={focusGroup}
                  />
                )
              }}
            </AuthUserContext.Consumer>
          </div>
        )
      })}
    </div>
  )
}

export default AllBlocksComponent
