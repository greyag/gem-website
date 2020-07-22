import React from 'react'
import unhLogo from '../../imgs/LeftSingleBlueWeb_RGB.png'

const Footer = () => (
  <div className='footer'>
    <p></p>
    <center>
      <img src={unhLogo} width='300' alt='University of NH logo' />
    </center>
    <p color='gray' className='center'>
      {' '}
      If you are experiencing any technical difficulties or have a question,
      please contact the Workshop Organizers at 2020vgem (at) gmail (dot) com.{' '}
      <br />
      {/* Dr. Chris Mouikis - cmouikis (at) atlas (dot) sr (dot) unh (dot) edu{' '}
      <br />
      Dr. Chia-Lin Huang - hcl (at) guero (dot) sr (dot) unh (dot) edu{' '} */}
    </p>
    <p></p>
    <p color='gray'>Site by Greta Gadbois</p>
  </div>
)

export default Footer
