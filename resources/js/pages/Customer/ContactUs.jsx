import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import '../../../css/ContactUs.css'; 

export default function ContactUs() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        fullname: '',
        email: '',
        type: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.send'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Contact Us | DivaBook" />
            
            <div className="contact-wrapper">
                <section className="contact-header">
                    <h2 className="section-title">Contact Us</h2>
                    <p className="section-subtitle">We are here to assist with your boutique wellness journey.</p>
                </section>

                {wasSuccessful && (
                    <div style={{ color: 'green', textAlign: 'center', marginBottom: '20px' }}>
                        Your inquiry has been sent successfully!
                    </div>
                )}

                <div className="contact-container">
                    <div className="contact-info">
                        <div className="info-group">
                            <label>MAIN ADDRESS</label>
                            <p>Inigo Street, Obrero <br />Davao City, 8000</p>
                        </div>
                        
                        <div className="info-row">
                            <div className="info-group">
                                <label>SUPPORT</label>
                                <p><a href="mailto:concierge@divabook.com">concierge@divabook.com</a></p>
                            </div>
                            <div className="info-group">
                                <label>PARTNERSHIPS</label>
                                <p><a href="mailto:partners@divabook.com">partners@divabook.com</a></p>
                            </div>
                        </div>

                        <div className="map-box">
                            <span>MAP VIEW</span>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h3>Inquiry Form</h3>
                        
                        <form id="inquiryForm" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="input-field">
                                    <label>FULL NAME</label>
                                    <input 
                                        type="text" 
                                        name="fullname" 
                                        placeholder="Jane Doe" 
                                        value={data.fullname}
                                        onChange={(e) => setData('fullname', e.target.value)}
                                        required 
                                    />
                                    {errors.fullname && <span className="error">{errors.fullname}</span>}
                                </div>

                                <div className="input-field">
                                    <label>EMAIL ADDRESS</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="jane@example.com" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required 
                                    />
                                    {errors.email && <span className="error">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="input-field">
                                <label>INQUIRY TYPE</label>
                                <select 
                                    name="type" 
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="General Support">General Support</option>
                                    <option value="Partnership Interest">Partnership Interest</option>
                                </select>
                                {errors.type && <span className="error">{errors.type}</span>}
                            </div>

                            <div className="input-field">
                                <label>MESSAGE</label>
                                <textarea 
                                    name="message" 
                                    placeholder="How can we assist you?" 
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                ></textarea>
                                {errors.message && <span className="error">{errors.message}</span>}
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-btn ${processing ? 'loading' : ''}`} 
                                id="sendBtn"
                                disabled={processing}
                            >
                                <span>{processing ? 'SENDING...' : 'SEND INQUIRY'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}