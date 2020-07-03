import React from 'react'
import headerPic from '../../imgs/gemHeader.jpg'
import { auto } from 'async'

// const style = {
//   width: 998,
//   height: auto,
//   border: ['2px', 'solid', '#000'],
//   margin: ['0px', '0px', '10px', '0px'],
// }

const Header = () => (
  <div>
    <img src={headerPic} alt='Header' className='header'></img>
  </div>
)

export default Header
