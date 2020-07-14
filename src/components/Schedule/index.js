import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { Link } from 'react-router-dom'
//import * as ROLES from '../../constants/roles'
import { BLOCKS } from '../../constants/blocks'
import { ROOMS } from '../../constants/rooms'
import { GROUPS } from '../../constants/splinterGroups'
import { Table } from 'react-bootstrap'
import * as ROUTES from '../../constants/routes'
import SlackLink from '../SlackLink'
import ZoomLink from '../ZoomLink'

// import { Link, withRouter } from 'react-router-dom'
// import { CardBody } from 'react-bootstrap/Card'

const Schedule = () => {
  let monday = [BLOCKS['monAM']]
  let tuesday = [
    BLOCKS['tuesAM'],
    BLOCKS['tuesAft'],
    BLOCKS['tuesEve'],
    BLOCKS['tuesPM'],
  ]
  let wednesday = [
    BLOCKS['wedAM'],
    BLOCKS['wedAft'],
    BLOCKS['wedEve'],
    BLOCKS['wedPM'],
  ]
  let thursday = [
    BLOCKS['thursAM'],
    BLOCKS['thursAft'],
    BLOCKS['thursEve'],
    BLOCKS['thursPM'],
  ]
  let days = [monday, tuesday, wednesday, thursday]

  return (
    <div>
      <h1>Schedule</h1>
      <p>
        VGEM will use Slack as the main communication platform before, during,
        and after the meeting. Please post your announcements, questions, and
        discussions on the <SlackLink />
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='http://gemworkshop.slack.com'
        >
          Slack Workspace for GEM
        </a>{' '}
        In the schedule below, each <SlackLink /> will take you to the
        appropriate slack channel. For more information or help, go{' '}
        <Link to={ROUTES.SLACK}>here.</Link>
      </p>
      <p>
        VGEM will be using <ZoomLink url='/' />
        Zoom to host presentations. To get to the correct room, Find the talk in
        the schedule or its topic page, and click the <ZoomLink url='/' />{' '}
        button.
      </p>
      <div>
        {days.map((blocks, ind) => (
          <Day blocks={blocks} key={ind} />
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
            <th style={{ width: 100 }}></th>
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
              <a href={ROUTES.STUDENTSCHEDULE}>{block.name}</a>
            </td>
          ) : block.name.includes('Plenary') ? (
            <td>
              <strong>
                <a href={ROUTES.PLENARY}>{block.name}</a>
              </strong>
            </td>
          ) : block.name.includes('Discussion') ? (
            <td>
              <strong>
                <a href={ROUTES.DISCUSSION}>{block.name}</a>
              </strong>
            </td>
          ) : (
            <td>
              <strong>{block.name}</strong>
            </td>
          )}
          {!block.name.includes('Student') && (
            <td>
              {(block.name.includes('Plenary') ||
                block.name.includes('Discussion')) && (
                <div>
                  <ZoomLink url={ROOMS[block.rooms[0]]} key={block.name} />
                  <SlackLink url={block.slack} />
                </div>
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
            <tr key={block.name + group + ind}>
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
                      <p key={group}>
                        <a href={`/focusGroups/${group}`}>
                          {GROUPS[group].longName}
                        </a>
                      </p>
                    ))}
                  </div>
                )}
              </td>
              <td>
                <ZoomLink url={ROOMS[block.rooms[ind]]} />
                {GROUPS[group] ? (
                  <SlackLink url={GROUPS[group].slack} />
                ) : (
                  <SlackLink
                    url={GROUPS[group[0]].slack}
                    key={block.name + group + ind}
                  />
                )}
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
