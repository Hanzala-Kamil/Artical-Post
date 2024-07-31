import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { CContainer, CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton, CModal, CModalBody, CModalFooter, CForm, CFormInput, CInputGroup } from '@coreui/react';
import { NavLink } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload } from '@coreui/icons';
import MessageBox from '../components/MessageBox';

function Home({ socket }) {
    const downloadPdf = useRef();
    const [data, setData] = useState([]);
    const [showCommentBox, setShowCommentBox] = useState({});
    const [commentInput, setCommentInput] = useState('');
    const [editCommentIndex, setEditCommentIndex] = useState(null);
    const [editPost, setEditPost] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const [currentPostOwner, setCurrentPostOwner] = useState('');

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        file: ""
    });

    const cardRefs = useRef([]);
    cardRefs.current = data.map((_, i) => cardRefs.current[i] ?? React.createRef());

    useEffect(() => {
        fetch('http://localhost:8000/getpost')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [data]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhoto = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/createpost", {
            method: "POST",
            headers: {
                "Authorization": token
            },
            body: form
        });
        if (res.ok) {
            const data = await res.json();
            alert(data.message);
        } else {
            alert("Error creating post");
        }
    };

    const handleLike = async (id) => {
        const res = await fetch(`http://localhost:8000/likeButton/${id}`, {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        if (res.ok) {
            const data = await res.json();
            setData(data.data)
            setShowCommentBox({});
            setIsEdit(false);
        } else {
            alert("Error like post");
        }
        setShowCommentBox({});
    };

    const handleComment = async (index) => {
        setShowCommentBox(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
        setCommentInput('');
        setEditCommentIndex(null);
    };

    const handleInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleSubmitComment = async (id) => {
        if (isEdit) {
            const postId = editPost.postId;
            const editId = editPost.editId;
            const bodycmnt = {
                comment: commentInput
            }
            const res = await fetch(`http://localhost:8000/editComment/${postId}/${editId}`, {
                method: "POST",
                body: JSON.stringify(bodycmnt),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })
            const data = await res.json();
            setData(data.data)
            setShowCommentBox({});
            setIsEdit(false);
        } else {
            const bodycmnt = {
                comment: commentInput
            }
            const res = await fetch(`http://localhost:8000/commentButton/${id}`, {
                method: "POST",
                body: JSON.stringify(bodycmnt),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            })
            const data = await res.json();
            setData(data.data)
            setCommentInput('')
        }
        setShowCommentBox({});
    };

    const handleEditComment = async (postId, editId, index) => {
        const post = data.find(ele => ele._id === postId)
        const comment = post.comments.find(ele => ele._id === editId)
        setCommentInput(comment.comment);
        comment.postId = postId;
        comment.editId = editId
        setIsEdit(true);
        setEditPost(comment)
        setShowCommentBox(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const deleteComment = async (postId, commentId) => {
        const bodycmnt = {
            comment: commentInput
        }
        const res = await fetch(`http://localhost:8000/deleteComment/${postId}/${commentId}`, {
            method: "POST",
            body: JSON.stringify(bodycmnt),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })
        const data = await res.json();
        setData(data.data)
    };

    const checkUser = localStorage.getItem('name');

    const GeneratePdf = useReactToPrint({
        content: () => downloadPdf.current,
        documentTitle: 'MyDocument',
    });

    const handleDownload = (index) => {
        downloadPdf.current = cardRefs.current[index].current;
        GeneratePdf();
    };

    const handleMessageBox = (postOwner) => {
        setCurrentPostOwner(postOwner);
        setMessageBoxVisible(true);
    };

    const handleCloseMessageBox = () => {
        setMessageBoxVisible(false);
    };

    return (
        <>
            <CContainer>
                <NavLink to="/View-post"><CButton color='info'>View Your Posts</CButton></NavLink>
            </CContainer>
            <CContainer className='w-50 p-1 my-2'>
                <CButton color="primary" onClick={() => setVisible(!visible)} className='w-100'>Create Post</CButton>
                <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
                    <CModalBody>
                        <CForm onSubmit={handleSubmit} encType='multipart/form-data'>
                            <CInputGroup className="mb-3">
                                <CFormInput type="file" id="inputGroupFile01" name='file' onChange={handlePhoto} />
                            </CInputGroup>
                            <CFormInput placeholder='Title' className='mb-3' name='title' onChange={handleInput} value={formData.title} />
                            <CFormInput placeholder='Description' className='mb-3' name='description' onChange={handleInput} value={formData.description} />
                            <CButton color="primary" type='submit' onClick={() => setVisible(false)}>Save changes</CButton>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    </CModalFooter>
                </CModal>
            </CContainer>
            {data.map((item, index) => (
                <CContainer className='w-50 p-1 mb-5' key={index} ref={cardRefs.current[index]}>
                    <CCard style={{ width: '100%' }} ref={cardRefs.current[index]}>
                        <CCardImage orientation="top" src={`http://localhost:8000/upload/${item.imageId.path}`} style={{ width: '100%', height: '250px', objectFit: "cover" }} alt='Image not found' />
                        <CCardBody>
                            <div style={{position:"relative"}}>
                                <CIcon 
                                    icon={cilCloudDownload} 
                                    title="Download Post" 
                                    className='ms-auto text-danger' 
                                    style={{position:"absolute", right:"10px" , fontSize:"30px" , cursor:"pointer"}} 
                                    onClick={() => handleDownload(index)}
                                />
                            </div>
                            <div className='mb-2'>
                                <CCardTitle>Post created by user : {item.parentId.name}</CCardTitle>
                                <CCardTitle>{item.title}</CCardTitle>
                                <CCardText>{item.description}</CCardText>
                                <CButton onClick={() => handleLike(item._id)} color='danger'>
                                    {item.likes.length} likes
                                </CButton>
                                <CButton className='ms-2' onClick={() => handleComment(index)} color='info'>
                                    {editCommentIndex !== null ? 'Edit Comment' : 'Comment'}
                                </CButton>
                                <CButton className='ms-2' onClick={() => handleShear(index)} color='primary'>
                                    Share
                                </CButton>
                                { checkUser !== item.parentId.name &&<CButton className='ms-5 px-5' color='secondary' onClick={() => handleMessageBox(item.parentId.name)}>
                                    Message
                                </CButton>
                                }

                            </div>
                            <div>
                                {item.comments.map((ele, i) => (
                                    <div key={i} className='d-flex justify-content-between mb-2' style={{ backgroundColor: '#f2f2f2', padding: '8px' }}>
                                        <CCardText key={ele._id} className='mb-2'><span>User : {ele.user.name}</span> || Comment : {ele.comment}</CCardText>
                                        {checkUser === ele.user.name && <div>
                                            <CButton className='ms-2' size="sm" color='danger' onClick={() => handleEditComment(item._id, ele._id, index)}>Edit</CButton>
                                            <CButton className='ms-2' size="sm" color='danger' onClick={() => deleteComment(item._id, ele._id)}>Delete</CButton>
                                        </div>}
                                    </div>
                                ))}

                                {showCommentBox[index] && (
                                    <div className='d-flex mb-2'>
                                        <CFormInput
                                            type="text"
                                            value={commentInput}
                                            onChange={handleInputChange}
                                        />
                                        <CButton color='success' onClick={() => handleSubmitComment(item._id)}>
                                            {editCommentIndex !== null ? 'Update' : 'Submit'}
                                        </CButton>
                                    </div>
                                )}
                            </div>
                        </CCardBody>
                    </CCard>
                </CContainer>
            ))}
            <MessageBox visible={messageBoxVisible} onClose={handleCloseMessageBox} postOwner={currentPostOwner} socket={socket} />
        </>
    );
}

export default Home;
