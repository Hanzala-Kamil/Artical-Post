import React from 'react';
import { CFooter, CContainer, CRow, CCol } from '@coreui/react';

function Footer() {
  return (
    <CFooter style={{bottom :"0"}} className='position-fixed w-100'>
      <CContainer>
        <CRow className='text-center'>
          <CCol xs={12} sm={6}>
            <p className="mb-0">
              &copy; All rights reserved by HANZALA.
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </CFooter>
  );
}

export default Footer;
