import React from 'react'
import { AiOutlineCloudDownload } from 'react-icons/ai'

const DownloadButton = ({ url, ...props }) => (
  <a href={url} download target='_blank' rel='noopener noreferrer'>
    {<AiOutlineCloudDownload size='30' />}
  </a>
)

export default DownloadButton
