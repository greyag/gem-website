import React from 'react'
import * as ROUTES from '../../constants/routes'
import SignOutButton from '../SignOut'
import { AuthUserContext } from '../Session'
import { Navbar, Nav, NavDropdown, NavLink } from 'react-bootstrap'
import { GROUPS } from '../../constants/splinterGroups'

import gemLogo from '../../imgs/gemLogo.png'
//import SignInPage from '../SignIn'

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
      <img src={gemLogo} height='40px' width='40px' alt='Gem Logo' />
    </Navbar.Brand>
    <Nav>
      <NavLink href={ROUTES.SCHEDULE}>Schedule</NavLink>
      <NavDropdown title='Focus Groups'>
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
      <NavLink href={ROUTES.PLENARY}>Plenary Sessions</NavLink>
      <NavLink href={ROUTES.DISCUSSION}>Decadal Discussion</NavLink>
      <NavLink href={ROUTES.STUDENTSCHEDULE}>Student Day</NavLink>
      <NavDropdown title='Posters'>
        <NavDropdown.Item key={'Information'} href='/posters/posterInfo'>
          Information
        </NavDropdown.Item>
        <NavDropdown.Item key={'Tuesday'} href={`/posters/day/tuesday`}>
          Tuesday
        </NavDropdown.Item>
        <NavDropdown.Item key={'Thursday'} href={`/posters/day/thursday`}>
          Thursday
        </NavDropdown.Item>
        <NavDropdown.Item key={'All'} href={`/posters/`}>
          All
        </NavDropdown.Item>
      </NavDropdown>
      <NavLink href={ROUTES.SLACK}>Slack</NavLink>
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
      <img src={gemLogo} height='40px' width='40px' alt='Gem Logo' />
    </Navbar.Brand>
    <Nav>
      <NavLink href={ROUTES.SCHEDULE}>Schedule</NavLink>
      <NavDropdown title='Focus Groups'>
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
      <NavLink href={ROUTES.PLENARY}>Plenary Sessions</NavLink>
      <NavLink href={ROUTES.DISCUSSION}>Decadal Discussion</NavLink>
      <NavLink href={ROUTES.STUDENTSCHEDULE}>Student Day</NavLink>
      <NavDropdown title='Posters'>
        <NavDropdown.Item key={'Information'} href={`${ROUTES.POSTERS}`}>
          Information
        </NavDropdown.Item>
        <NavDropdown.Item key={'Tuesday'} href={`/posters/day/tuesday`}>
          Tuesday
        </NavDropdown.Item>
        <NavDropdown.Item key={'Thursday'} href={`/posters/day/thursday`}>
          Thursday
        </NavDropdown.Item>
      </NavDropdown>
      <NavLink href={ROUTES.SLACK}>Slack</NavLink>

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
