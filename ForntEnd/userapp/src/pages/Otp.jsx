import React, { useState } from 'react';
import { CForm, CRow, CFormLabel, CFormInput, CCol, CButton, CContainer, CFormFeedback } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';


function Otp() {
    const [formValue, setFormValue] = useState({
        email: '',
        otp: ''
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
            const res = await fetch("http://localhost:8000/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValue)
            });

            const data = await res.json();
            alert(data.message)
            if(data.message === "User verified successfully"){
                navigate("/")
            }
            console.log(data);
        }
        setValidated(true);
    };
    return (
        <>
            <CContainer className='py-4 w-50'>
                <h2>Confirm OTP</h2>
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
                    <CFormLabel htmlFor="otp" className="col-sm-2 col-form-label">OTP</CFormLabel>
                        <CCol sm={10}>
                            <CFormInput
                                type="text"
                                name='otp'
                                value={formValue.otp}
                                onChange={handleInput}
                                required
                            />
                        </CCol>
                    </CRow>
                    <CButton color="primary" type="submit">submit</CButton>
                </CForm>
            </CContainer>
        </>
    )
}

export default Otp