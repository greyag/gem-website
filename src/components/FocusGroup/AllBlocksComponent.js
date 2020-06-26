import React from 'react'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'
import { GROUPS } from '../../constants/focusGroups'
import {
  OneBlockComponentHost,
  OneBlockComponentAttendee,
} from './OneBlockComponents'

const AllBlocksComponent = ({
  //talkObj = {},
  removeTalk,
  moveTalk,
  focusGroup,
}) => {
  let blocks = GROUPS[focusGroup]
    ? [...GROUPS[focusGroup].blocks, 'unscheduled']
    : []
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
                    //talks={talkObj[block]}
                    removeTalk={(talkId) => removeTalk(block, talkId)}
                    moveTalk={moveTalk}
                    blocks={blocks}
                    focusGroup={focusGroup}
                  />
                ) : (
                  <OneBlockComponentAttendee
                    block={block}
                    //talks={talkObj[block]}
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
