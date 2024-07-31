import React, { useState } from 'react';
import { CForm, CRow, CFormLabel, CFormInput, CCol, CButton, CContainer, CFormFeedback } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";

function AdminLogin() {
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    });
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            const res = await fetch("http://localhost:8000/adminLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValue)
            });

            const data = await res.json();
            // console.log(data.checkUser.name)
            alert(data.message)
            if (data.message === "Login successful") {
                navigate("/admin-panal")
                localStorage.setItem('token', data.token)
                localStorage.setItem('name', data.checkUser.name)
            }
        }
        setValidated(true);
    };


    return (
        <>
            <CContainer className='py-4 w-50'>
                <h2>Admin Login</h2>
                <CForm
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">Email</CFormLabel>
                        <CCol sm={10}>
                            <CFormInput
                                type="email"
                                id="email"
                                placeholder='example@gmail.com'
                                name='email'
                                value={formValue.email}
                                onChange={handleInput}
                                required
                            />
                            <CFormFeedback invalid>Please enter a valid email address.</CFormFeedback>
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="password" className="col-sm-2 col-form-label">Password</CFormLabel>
                        <CCol sm={10}>
                            <CFormInput
                                type="password"
                                id="password"
                                name='password'
                                value={formValue.password}
                                onChange={handleInput}
                                required
                            />
                            <CFormFeedback invalid>Please enter your password.</CFormFeedback>
                        </CCol>
                    </CRow>
                    <CButton color="primary" type="submit">Login</CButton>
                </CForm>
                    {/* <div>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                const credentialResponseDecode = jwtDecode(credentialResponse.credential)
                                console.log(credentialResponseDecode);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div> */}
                <NavLink to="/admin-signup">signup Admin if you dont have account</NavLink>
            </CContainer>
        </>
    );
}

export default AdminLogin;