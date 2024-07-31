import React, { useState, useEffect } from 'react';
import { CContainer, CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';


function AllUsers() {
    const [data, setData] = useState([]);
    // console.log(data)

    useEffect(() => {
        fetch('http://localhost:8000/viewAllUsers')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [data]);

    return (
        <>
            <div>
                <NavLink to="/admin-panal"><CButton color="primary">BACK TO DASHBORD</CButton></NavLink>
            </div>
            <h1 className='text-center my-3'>All Users</h1>
            {data.map((item, index) => (
                <CContainer className='w-50 p-1 mb-5' key={index}>
                    <CCard style={{ width: '100%' }}>
                        <CCardBody>
                            <div className='mb-2'>
                                <CCardTitle>User no : {index + 1}</CCardTitle>
                                <CCardTitle>User Name : {item.parentId.name}</CCardTitle>
                                <CCardTitle>Role : {item.parentId.role}</CCardTitle>
                                <CCardTitle>Likes : {item.likes.length}</CCardTitle>
                                <CCardTitle>Comments : {item.comments.length}</CCardTitle>
                                <CCardTitle>Number of posts : {item.parentId.postCount}</CCardTitle>
                            </div>

                        </CCardBody>
                    </CCard>
                </CContainer>
            ))}
        </>
    )
}

export default AllUsers