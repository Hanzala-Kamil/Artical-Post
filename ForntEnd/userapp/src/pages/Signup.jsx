import React, { useState } from 'react';
import { CForm, CRow, CFormLabel, CFormInput, CCol, CButton, CContainer, CFormFeedback } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

function Signup() {
    const [formValue, setFormValue] = useState({
        name: '',
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
            const res = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValue)
            });

            const data = await res.json();
            alert(data.message)
            if (data.message === "User created successfully, OTP sent") {
                navigate("/otp")
            }
            console.log(data);
        }
        setValidated(true);
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        const credential = credentialResponse.credential;
        console.log(credential)
        const credentialResponseDecode = jwtDecode(credentialResponse.credential)
        console.log(credentialResponseDecode)
        const res = await fetch("http://localhost:8000/google-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: credential  }) 
        });

        const data = await res.json();
        alert(data.message);
        if (data.message === "Login successful") {
            navigate("/home");
        }
        console.log(data);
    };

    return (
        <>
            <CContainer className='py-4 w-50'>
                <h2>Sign Up</h2>
                <CForm
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >
                    <CRow className="mb-3">
                        <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">Name</CFormLabel>
                        <CCol sm={10}>
                            <CFormInput
                                type="name"
                                id="name"
                                placeholder='Enter your name'
                                name='name'
                                value={formValue.name}
                                onChange={handleInput}
                                required
                            />
                            <CFormFeedback invalid>Please enter a valid email address.</CFormFeedback>
                        </CCol>
                    </CRow>
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
                    <CButton color="primary" type="submit">Sign Up</CButton>
                    <div>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                    </div>
                </CForm>
            {/* <NavLink to="/admin-signup">singup admin</NavLink> */}
            </CContainer>
        </>
    )
}

export default Signup;