import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
//import * as ROLES from '../../constants/roles'
import { discussionHosts } from './hosts'
import { decedal } from './decedal'
import { Table } from 'react-bootstrap'

const Discussion = (props) => {
  return (
    <div>
      <h1>Decadal Future and beyond!</h1>
      <h4>
        <div>
          {decedal.date}, {decedal.time}
        </div>
      </h4>
      <p>
        As the community prepares for the next Solar and Space Physics Decadal
        Survey and strategic planning that goes beyond the next decade, it’s a
        good time to start a discussion on the current understanding of
        Geospace, remaining gaps, and challenges, as well as needs for future
        investigations. More information about this session will be posted on
        the{' '}
        <a
          href='https://gem.epss.ucla.edu/mediawiki/index.php/2020_Virtual-GEM_Workshop'
          target='_blank'
          rel='noopener noreferrer'
          title='GEM Wiki'
        >
          {' '}
          GEM Wiki.{' '}
        </a>
      </p>
      <p>
        Please contact us with any comments or suggestions you have on topics to
        discuss or other ideas about this brainstorming session and its
        implementation:
      </p>
      <ul>
        {discussionHosts.map((host, ind) => (
          <li key={ind}>{host}</li>
        ))}
      </ul>
      <h4>Presentations</h4>
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(Discussion)
