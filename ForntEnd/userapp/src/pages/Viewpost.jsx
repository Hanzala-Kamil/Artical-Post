import React from 'react';
import { CContainer, CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';
import { useState, useEffect } from 'react';

function Viewpost() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/getpostById', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem("token"),
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Fetched data:', data); 
                setData(data);
            })
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
            {data.map((item, i) => (
                <CContainer className='w-50 p-1 mb-5 ' key={i}>
                    <CCard style={{ width: '100%' }}>
                        <CCardImage orientation="top" src={`http://localhost:8000/upload/${item.imageId.path}`} style={{ width: '100%', height: '250px', objectFit: "cover" }} alt='Image not found' />
                        <CCardBody>
                            <CCardTitle>{item.title}</CCardTitle>
                            <CCardText>{item.description}</CCardText>
                        </CCardBody>
                        <div className='my-2'>
                            <CButton className='ms-2' color='info'>
                                Edit
                            </CButton>
                            <CButton className='ms-2' color='primary' onClick={() => handleDelete(item._id)}>
                                Delete
                            </CButton>
                        </div>
                    </CCard>
                </CContainer>
            ))}
        </>
    );
}

export default Viewpost;