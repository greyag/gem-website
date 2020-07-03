import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
//import * as ROLES from '../../constants/roles'
import { BLOCKS } from '../../constants/blocks'
import { ROOMS } from '../../constants/rooms'
import { GROUPS } from '../../constants/splinterGroups'
import { Table } from 'react-bootstrap'

// import { Link, withRouter } from 'react-router-dom'
// import { CardBody } from 'react-bootstrap/Card'

const Schedule = () => {
  let monday = [BLOCKS['monAM']]
  let tuesday = [BLOCKS['tuesAM'], BLOCKS['tuesAft'], BLOCKS['tuesEve']]
  let wednesday = [BLOCKS['wedAM'], BLOCKS['wedAft'], BLOCKS['wedEve']]
  let thursday = [BLOCKS['thursAM'], BLOCKS['thursAft'], BLOCKS['thursEve']]
  let days = [monday, tuesday, wednesday, thursday]

  return (
    <div>
      <h1>Schedule</h1>
      <div>
        {days.map((blocks) => (
          <Day blocks={blocks} key={blocks[0].order} />
        ))}
      </div>
    </div>
  )
}
const Day = ({ blocks }) => {
  const makeTable = (blocks) => {
    let head = (
      <thead>
        <tr>
          <th style={{ width: 180 }}>Time (Eastern Time)</th>
          <th></th>
          {!blocks[0].date.includes('Monday') && (
            <th style={{ width: 100 }}>Zoom Link</th>
          )}
        </tr>
      </thead>
    )
    let body = []
    blocks.forEach((block, ind) => {
      body.push(
        <tr key={ind}>
          <td>{block.time}</td>
          {block.name.includes('Student') ? (
            <td>
              <a href='/student'>{block.name}</a>
            </td>
          ) : (
            <td>{block.name}</td>
          )}
          {!block.name.includes('Student') && (
            <td>
              {block.name.includes('Plenary') && (
                <a
                  target='_blank'
                  rel='noreferrer'
                  href={`${ROOMS[block.rooms[0]]}`}
                >
                  Zoom Link
                </a>
              )}
            </td>
          )}
        </tr>
      )
      block.groups.forEach((group, ind) => {
        if (
          !block.name.includes('Plenary') &&
          !block.name.includes('Student')
        ) {
          body.push(
            <tr key={block.name + group}>
              <td></td>
              <td>
                {typeof group === 'string' ? (
                  <a href={`/focusGroups/${group}`}>
                    {GROUPS[group] && GROUPS[group].longName}
                  </a>
                ) : (
                  <div>
                    Joint Session
                    {group.map((group) => (
                      <p>
                        <a href={`/focusGroups/${group}`}>
                          {GROUPS[group].longName}
                        </a>
                      </p>
                    ))}
                  </div>
                )}
              </td>
              <td>
                <a href={ROOMS[block.rooms[ind]]}>Zoom Link</a>
              </td>
            </tr>
          )
        } else if (true) {
        }
      })
    })

    return (
      <div>
        <Table bordered hover size='sm'>
          {head}
          <tbody>{body}</tbody>
        </Table>
      </div>
    )
  }

  return (
    <div>
      <h3>{blocks[0] && blocks[0].date}</h3>
      {makeTable(blocks)}
    </div>
  )
}

//const condition = (authUser) => !!authUser.roles[ROLES.ADMIN]

//export default compose(withFirebase)(SchedulePage)

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(Schedule)
