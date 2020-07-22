import React from 'react'
import { AiOutlinePlayCircle } from 'react-icons/ai'

const VideoLink = ({ url, ...props }) => {
  return (
    <span>
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        title='Link to Video'
      >
        <AiOutlinePlayCircle title='Link to Videos' height='100' width='100' />
      </a>
    </span>
  )
}

export default VideoLink
