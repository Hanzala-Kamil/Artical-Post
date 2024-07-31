import React from 'react'
import { CButton, CContainer } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';

function AdminPanal() {
    return (
        <>
            <h1 className='text-center my-5'>Admin panal</h1>
            <CContainer className='d-flex justify-content-between w-50'>
                <div className='border p-5'>
                    <NavLink to="/all-users"><CButton color="primary">View All Users</CButton></NavLink>
                </div>
                <div className='border p-5'>
                    <NavLink to="/all-posts"><CButton color="primary">View All post</CButton></NavLink>
                </div>
            </CContainer>
        </>
    )
}

export default AdminPanal