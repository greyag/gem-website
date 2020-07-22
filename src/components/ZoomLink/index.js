import React, { useState } from 'react'
import logo from '../../imgs/zoom-logo-assets/zoom-logo.png'
import { AiFillPhone } from 'react-icons/ai'
import { Modal } from 'react-bootstrap'

const ZoomLink = ({ url = {} }) => {
  const [showModal, setShowModal] = useState(false)
  const handleToggle = () => setShowModal(!showModal)

  return (
    <span>
      <a
        href={url.url}
        target='_blank'
        rel='noopener noreferrer'
        title='Link to Zoom'
      >
        <img src={logo} alt='zoom link' height='35' width='35' />
      </a>
      <AiFillPhone
        size='30'
        onClick={() => handleToggle()}
        title='Dial in to Zoom'
        color='#4B8CFF'
      />
      <Modal
        show={showModal}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop={true}
        onHide={handleToggle}
      >
        <Modal.Body>
          Phone Number: +{url.phoneNumber} <br />
          Webinar Id: {url.id} <br />
          <a
            href='https://unh.zoom.us/zoomconference?m=6pWkQwQlXKdHVulw4E2dSMrjd7H10CSe&_x_zm_rtaid=GAtBV1__QmW-LHEBwQxgmQ.1595343458317.8c879c8d4b7c667d9c40703189c5f122&_x_zm_rhtaid=315'
            target='_blank'
            rel='noopener noreferrer'
            title='Zoom Phone Numbers'
          >
            For better audio quality, you can try calling any number off of this
            list. Use a number located closer to you. (International numbers
            available)
          </a>
        </Modal.Body>
      </Modal>
    </span>
  )
}

export default ZoomLink
