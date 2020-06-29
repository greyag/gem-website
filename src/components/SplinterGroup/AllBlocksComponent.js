import React from 'react'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'
import { GROUPS } from '../../constants/splinterGroups'
import {
  OneBlockComponentHost,
  OneBlockComponentAttendee,
} from './OneBlockComponents'

const AllBlocksComponent = ({
  //talkObj = {},
  removeTalk,
  moveTalk,
  splinterGroup,
}) => {
  let blocks = GROUPS[splinterGroup]
    ? [...GROUPS[splinterGroup].blocks, 'unscheduled']
    : []
  console.log('blocks:', blocks)
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
                    splinterGroup={splinterGroup}
                  />
                ) : (
                  <OneBlockComponentAttendee
                    block={block}
                    //talks={talkObj[block]}
                    splinterGroup={splinterGroup}
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
