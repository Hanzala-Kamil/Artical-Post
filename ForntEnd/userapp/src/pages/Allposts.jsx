import React, { useState, useEffect } from 'react';
import { CContainer, CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';

function Allposts() {
    const [data, setData] = useState([]);
    // console.log(data)

    useEffect(() => {
        fetch('http://localhost:8000/getAdminPost')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [data]);


    const handleDelete = (id) => {
        // console.log('Deleting post with id:', id);
        fetch(`http://localhost:8000/deletePost/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem("token"),
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Delete Post')
                    setData(data.filter(item => item.id !== id));
                } else {
                    alert('Not delete post due to some reason try again')
                }
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    return (
        <>
        <div>
        <NavLink to="/admin-panal"><CButton color="primary">BACK TO DASHBORD</CButton></NavLink>
        </div>
            <h1 className='text-center my-3'>All posts</h1>
            {data.map((item, index) => (
                <CContainer className='w-50 p-1 mb-5' key={index}>
                    <CCard style={{ width: '100%' }}>
                        <CCardImage orientation="top" src={`http://localhost:8000/upload/${item.imageId.path}`} style={{ width: '100%', height: '250px', objectFit: "cover" }} alt='Image not found' />
                        <CCardBody>
                            <div className='mb-2'>
                                <CCardTitle>{item.title}</CCardTitle>
                                <CCardText>{item.description}</CCardText>
                                <CCardText className='bg-primary text-white'>This post is created by User : {item.parentId.name}</CCardText>
                                <CButton color='danger' onClick={() => handleDelete(item._id)}>
                                    delete Post
                                </CButton>
                            </div>
                  
                        </CCardBody>
                    </CCard>
                </CContainer>
            ))}
        </>
    );
}

export default Allposts