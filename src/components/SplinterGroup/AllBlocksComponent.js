import React from 'react'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'
import { GROUPS } from '../../constants/splinterGroups'
import OneBlockComponent from './OneBlockComponents'

const AllBlocksComponent = ({
  //talkObj = {},
  removeTalk,
  moveTalk,
  splinterGroup,
  zooms,
}) => {
  let blocks = GROUPS[splinterGroup]
    ? [...GROUPS[splinterGroup].blocks, 'unscheduled']
    : []
  return (
    <div>
      {blocks.map((block) => {
        return (
          <div key={block}>
            <AuthUserContext.Consumer>
              {(authUser) => {
                let isHost = authUser && authUser.roles.HOST === ROLES.HOST
                return (
                  <OneBlockComponent
                    block={block}
                    removeTalk={(talkId) => removeTalk(block, talkId)}
                    moveTalk={moveTalk}
                    blocks={blocks}
                    splinterGroup={splinterGroup}
                    isHost={isHost}
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
