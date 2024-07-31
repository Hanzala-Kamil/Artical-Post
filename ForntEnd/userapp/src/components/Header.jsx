import React from 'react';
import { CNavbar, CContainer, CNavbarBrand, CNavbarNav, CNavItem, CNavLink, CForm, CFormInput, CButton } from '@coreui/react';
// import { CgProfile } from '../assets/logo.png';
import logo from '../assets/logo.png'
import { NavLink ,useNavigate } from 'react-router-dom';


function Header() {

  const emptyLocaal = () => {
    localStorage.clear();
  }

  return (
    <CNavbar colorScheme="light" className="bg-light position-sticky w-100" style={{top :"0" , zIndex: '2'}}>
      <CContainer className='p-3'>
        <CNavbarBrand >
        <NavLink to="/home"><img src={logo} alt="Logo" height="30" /></NavLink>
        </CNavbarBrand>
        <CNavbarNav className="justify-content-center flex-grow-1">
          <CForm className="d-flex">
            <CFormInput
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="me-2"
            />
            <CButton color="outline-success" type="submit">
              Search
            </CButton>
            <NavLink to="/"><CButton color='danger' onClick={emptyLocaal}>Logout</CButton>

          </NavLink>
          </CForm>
        </CNavbarNav>
      </CContainer>
    </CNavbar>
  );
}

export default Header;
