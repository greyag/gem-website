import React from 'react'
import { compose } from 'recompose'
import { withAuthorization } from '../Session'
import SlackLink from '../SlackLink'

const Slack = () => {
  return (
    <div>
      <h1>Slack Information</h1>
      <p>
        VGEM will use Slack as the main communication platform before, during,
        and after the meeting. Please post your announcements, questions, and
        discussions on the Slack Workspace for GEM.
      </p>
      <p>
        If you already have a Slack account, you can find our workspace at:{' '}
        <SlackLink />
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='http://gemworkshop.slack.com'
        >
          gemworkshop.slack.com
        </a>
      </p>
      <p>
        If you have not tried Slack, you can join now using the following
        invitation link:{' '}
        <SlackLink url='https://join.slack.com/t/gemworkshop/shared_invite/zt-fq34nh1c-N8Q_s~VUPOpRGvB9qXSQyg' />
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://join.slack.com/t/gemworkshop/shared_invite/zt-fq34nh1c-N8Q_s~VUPOpRGvB9qXSQyg'
        >
          You're invited!
        </a>{' '}
      </p>
      <p>
        New to Slack? This link may assist you:{' '}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://slack.com/resources/slack-101/what-is-slack'
        >
          Slack 101
        </a>{' '}
      </p>
    </div>
  )
}

const condition = (authUser) => !!authUser

export default compose(withAuthorization(condition))(Slack)
