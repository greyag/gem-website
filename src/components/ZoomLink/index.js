import React from 'react'
import logo from '../../imgs/zoom-logo-assets/zoom-logo.png'

const ZoomLink = ({ url = '/' }) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      title='Link to Zoom'
    >
      <img src={logo} alt='zoom link' height='35' width='35' />
    </a>
  )
}

export default ZoomLink
