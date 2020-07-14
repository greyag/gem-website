import React from 'react'
import logo from '../../imgs/slack-logo-assets/slack-logo-icon.svg'

const SlackLink = ({ url = 'http://gemworkshop.slack.com' }) => {
  if (!url.startsWith('http')) {
    url = 'https://' + url
  }
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      title='Link to Slack'
    >
      <img src={logo} alt='slack link' height='40' width='40' />
    </a>
  )
}

export default SlackLink
