import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import SignOutButton from '../SignOut'
import { AuthUserContext } from '../Session'
import * as ROLES from '../../constants/roles'
import { Navbar, Nav, NavDropdown, NavLink } from 'react-bootstrap'
import { GROUPS } from '../../constants/splinterGroups'

import gemLogo from '../../imgs/gemLogo.png'
import SignInPage from '../SignIn'

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = ({ authUser }) => (
  <Navbar className='color-nav' variant='light'>
    <Navbar.Brand href={ROUTES.SCHEDULE}>
      <img src={gemLogo} height='40px' width='40px' />
    </Navbar.Brand>
    <Nav>
      <NavLink href={ROUTES.SCHEDULE}>Schedule</NavLink>
      <NavDropdown title='Splinter Groups'>
        {Object.keys(GROUPS).map((groupId) => (
          <NavDropdown.Item
            key={groupId}
            href={`${ROUTES.FOCUSGROUPS}/${groupId}`}
            //className='text-wrap'
            width='500px'
          >
            {GROUPS[groupId].longName}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
      <SignOutButton />
    </Nav>
  </Navbar>
)
/* /* <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li> */
//   <li>
//     <Link to={ROUTES.SCHEDULE}>Schedule</Link>
//   </li>
//   <li>
//     <Link to={ROUTES.FOCUSGROUPS}>Splinter Groups</Link>
//   </li>
//   {!!authUser.roles[ROLES.ADMIN] && (
//     <li> */}
//       <Link to={ROUTES.ADMIN}>Admin </Link>
//     </li>
//   )}
//   <li>
//     <SignOutButton />
//   </li>
// </ul>

const NavigationNonAuth = () => (
  <Navbar className='color-nav' variant='light'>
    <Navbar.Brand href={ROUTES.SCHEDULE}>
      <img src={gemLogo} height='40px' width='40px' />
    </Navbar.Brand>
    <Nav>
      <NavLink href={ROUTES.SCHEDULE}>Schedule</NavLink>
      <NavDropdown title='Splinter Groups'>
        {Object.keys(GROUPS).map((groupId) => (
          <NavDropdown.Item
            key={groupId}
            href={`${ROUTES.FOCUSGROUPS}/${groupId}`}
          >
            {GROUPS[groupId].longName}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
      <NavLink href={ROUTES.SIGN_IN} as='button'>
        Sign In
      </NavLink>
    </Nav>
  </Navbar>
)
//   <div>
//     <Navbar variant='light'>
//       <Navbar.Brand href={ROUTES.SCHEDULE}>
//         <img src='../../gemLogo.png' />
//       </Navbar.Brand>
//       <Nav>
//         <NavLink href={ROUTES.SCHEDULE}>Schedule</NavLink>
//         <NavDropdown title='Splinter Groups'>
//           {Object.keys(GROUPS).map((groupId) => (
//             <NavDropdown.Item
//               key={groupId}
//               href={`${ROUTES.FOCUSGROUPS}/${groupId}`}
//             >
//               {GROUPS[groupId].longName}
//             </NavDropdown.Item>
//           ))}
//         </NavDropdown>
//         <NavLink as='button' href={ROUTES.SIGN_IN}>
//           Sign In
//         </NavLink>
//       </Nav>
//     </Navbar>
//   </div>
// )

export default Navigation
