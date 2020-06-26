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
  let monday = [BLOCKS['monAM'], BLOCKS['monAft'], BLOCKS['monEve']]
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
          <th>Time</th>
          <th>Splinter Group</th>
          <th>More Info</th>
          <th>Zoom Link</th>
        </tr>
      </thead>
    )
    let body = []
    blocks.forEach((block, ind) => {
      body.push(
        <tr key={ind}>
          <td>{block.time}</td>
          <td>{block.name}</td>
          <td>
            {(block.name.includes('Plenary') ||
              block.name.includes('Student')) && (
              <a href={`/focusgroup/${block.name}`}>More Info</a>
            )}
          </td>
          <td>
            {(block.name.includes('Plenary') ||
              block.name.includes('Student')) && (
              <a href={`${ROOMS[block.rooms[0]]}`}>Zoom Link</a>
            )}
          </td>
        </tr>
      )
      block.groups.forEach((group, ind) => {
        if (!block.name.includes('Plenary') && !block.name.includes('Student'))
          body.push(
            <tr key={block.name + group}>
              <td></td>
              <td>
                {typeof group === 'string'
                  ? GROUPS[group].longName
                  : group.map((group) => GROUPS[group].longName).join('\n & ')}
              </td>
              <td>
                {typeof group === 'string' ? (
                  <a href={`/focusGroups/${group}`}>More Info</a>
                ) : (
                  group.map((group, ind) => (
                    <a href={`/focusGroups/${group}`} key={group + ind}>
                      More Info {ind + 1}{' '}
                    </a>
                  ))
                )}
              </td>
              <td>
                <a href={ROOMS[block.rooms[ind]]}>Zoom Link</a>
              </td>
            </tr>
          )
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

  // return (
  //   <div>
  //     <h3>{blocks[0] && blocks[0].date}</h3>
  //     <div>
  //       {blocks.map((block) => {
  //         const makeLink = (group) => (
  //           <Link to={{ pathname: `/focusgroups/${group}` }}>Talks Here</Link>
  //         )
  //         return (
  //           <div>
  //             <Table bordered hover size='sm'>
  //               {}

  //               <tbody>
  //                 {block.groups.length &&
  //                   block.groups.map((group, ind) => {
  //                     console.log(block)
  //                     console.log(ROOMS[block.rooms[ind]])
  //                     return (
  //                       <div>
  //                         <tr>
  //                           <td>{block.time}</td>
  //                           <td>{group}</td>
  //                           <td>{makeLink(group)}</td>
  //                           <td>{ROOMS[block.rooms[ind]]}</td>
  //                         </tr>
  //                       </div>
  //                     )
  //                   })}
  //               </tbody>
  //             </Table>
  //           </div>
  //         )
  //       })}
  //     </div>
  //   </div>
  // )
}
{
  /* const BlockPublic = (block) => {} */
}

//const condition = (authUser) => !!authUser.roles[ROLES.ADMIN]

//export default compose(withFirebase)(SchedulePage)

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(Schedule)
