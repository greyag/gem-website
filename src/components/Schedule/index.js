import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import { withFirebase } from '../../server/Firebase'
import { Link } from 'react-router-dom'
//import * as ROLES from '../../constants/roles'
import { BLOCKS } from '../../constants/blocks'
import { GROUPS } from '../../constants/splinterGroups'
import { Table } from 'react-bootstrap'
import * as ROUTES from '../../constants/routes'
import SlackLink from '../SlackLink'
import ZoomLink from '../ZoomLink'
import videoUrls from '../../constants/vidUrls'
import { PLENARY } from '../../constants/plenary'
import VideoLink from '../VideoLink'

// import { Link, withRouter } from 'react-router-dom'
// import { CardBody } from 'react-bootstrap/Card'

const useZooms = (firebase) => {
  const [zooms, setZooms] = useState({})
  useEffect(() => {
    let newZooms = {}
    const unsubscribe = firebase.db
      .ref(`/1iQK8lA6Ubi9MvxCLl0LbTMmNmydPQ86bMbVLs1hzeJ0/Zooms/`)
      .on('value', (snapshot) => {
        let data = snapshot.val()
        Object.keys(data).map((room) => {
          newZooms[data[room].room] = data[room]
        })
        setZooms(newZooms)
      })
    return unsubscribe
  }, [firebase])
  return zooms
}

const Schedule = (props) => {
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
    BLOCKS['thursPPM'],
  ]
  let days = [monday, tuesday, wednesday, thursday]

  const zooms = useZooms(props.firebase)

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
          <Day blocks={blocks} key={ind} zooms={zooms} />
        ))}
      </div>
    </div>
  )
}
const Day = ({ blocks, zooms, ...props }) => {
  const makeTable = (blocks) => {
    let head = (
      <thead>
        <tr>
          <th style={{ width: 180 }}>Time (EDT or GMT - 4)</th>
          <th></th>

          <th style={{ width: 100 }}></th>
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
          ) : block.name.includes('Poster') ? (
            <td>
              <strong>
                <a href={block.link}>{block.name}</a>
              </strong>
            </td>
          ) : (
            <td>
              <strong>{block.name}</strong>
            </td>
          )}
          <td width='120px'>
            {(block.name.includes('Plenary') ||
              block.name.includes('Discussion') ||
              block.name.includes('Student')) && (
              <div>
                {block.done ? (
                  <h3>
                    {videoUrls[
                      block.name.includes('Plenary')
                        ? 'plenary'
                        : block.name.includes('Discussion')
                        ? 'discussion'
                        : 'student'
                    ] && (
                      <VideoLink
                        url={
                          videoUrls[
                            block.name.includes('Plenary')
                              ? 'plenary'
                              : block.name.includes('Discussion')
                              ? 'discussion'
                              : 'student'
                          ]
                        }
                      />
                    )}
                    <SlackLink url={block.slack} />
                  </h3>
                ) : (
                  <span>
                    {!block.done && (
                      <ZoomLink url={zooms[block.rooms[0]]} key={block.name} />
                    )}
                    <SlackLink url={block.slack} />
                  </span>
                )}
              </div>
            )}
            {block.name.includes('Memorial') && (
              <div>
                {!block.done && (
                  <ZoomLink url={zooms[block.rooms[0]]} key={block.name} />
                )}
                <SlackLink url={block.slack} />
              </div>
            )}
          </td>
        </tr>
      )
      block.groups.forEach((group, ind) => {
        if (
          !block.name.includes('Plenary') &&
          !block.name.includes('Student') &&
          !block.name.includes('Sam')
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
                {!block.done ? (
                  <div>
                    <ZoomLink url={zooms[block.rooms[ind]]} />
                    {GROUPS[group] ? (
                      <SlackLink url={GROUPS[group].slack} />
                    ) : (
                      <SlackLink
                        url={GROUPS[group[0]].slack}
                        key={block.name + group + ind}
                      />
                    )}
                  </div>
                ) : (
                  <h3>
                    {GROUPS[group] ? (
                      <SlackLink url={GROUPS[group].slack} />
                    ) : (
                      <SlackLink
                        url={GROUPS[group[0]].slack}
                        key={block.name + group + ind}
                      />
                    )}
                  </h3>
                )}
              </td>
            </tr>
          )
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

export default compose(withAuthorization(condition), withFirebase)(Schedule)
