import React, { useState, useLayoutEffect } from 'react';

const styles = `
:root {
    --primary-dark: #074533;
    --text-main: #333333;
    --text-muted: #757575;
    --bg-light: #f9f8f6; 
    --border-color: #e0e0e0;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body { 
    background-color: #FAFAF9; 
    margin: 0;  
    padding: 0;  
    font-family: 'Inter', sans-serif;
    overflow-x: hidden; 
}

#title {
    font-family: 'Noto Serif', serif;
    font-size: 28px;
    font-weight: 400;
    color: #064E3B;
    text-align: center;      
    text-transform: uppercase;
    letter-spacing: 5px;    
    margin: 30px 0 10px 0;  
    width: 100%;
    grid-column: 1 / -1;   
    padding-top: 10px;
    padding-bottom: 50px;
}

/* Layout */
.container {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 20px;
}

.content-layout {
    display: flex;
    gap: 60px;
    align-items: flex-start;
}

/* Progress Bar */
.progress-container {
    display: flex;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 50px;
}

.progress-step {
    flex: 1;
    padding-bottom: 10px;
}

.progress-step.active {border-bottom: 3px solid var(--primary-dark);}

.step-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--text-muted);
}

.progress-step.active .step-label {color: var(--primary-dark);}

.personal-details-form {flex: 2;}

.section-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 30px;
}

.input-row {
    display: flex;
    gap: 20px;
}

.input-group {
    margin-bottom: 25px;
    flex: 1;
}

label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 8px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
textarea {
    width: 100%;
    padding: 12px 0;
    border: none;
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
}

input::placeholder, textarea::placeholder {
    color: #b0b0b0;
    padding-left: 10px;
}

input:focus, textarea:focus {border-bottom: 1px solid var(--primary-dark);}

.phone-input {
    display: flex;
    align-items: center;
}

.country-code {
    padding-right: 15px;
    font-size: 14px;
}

textarea {
    height: 80px;
    resize: none;
}

.marketing-opt-in {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin: 40px 0;
    font-size: 13px;
    color: #555;
    padding-top: 0px;
}

.cta-button {
    width: 100%;
    background-color: var(--primary-dark);
    color: white;
    border: none;
    padding: 18px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: opacity 0.3s;
}

.cta-button:hover {opacity: 0.9;}

.secure-footer {
    text-align: center;
    font-size: 10px;
    color: #999;
    margin-top: 20px;
    letter-spacing: 0.5px;
}

/* Sidebar / Booking Summary */
.booking-summary {
    flex: 1;
    background-color: var(--bg-light);
    padding: 30px;
}

.booking-summary h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 25px;
}

.salon-identity-bar {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0ddd5;
}

.b2-logo-wrap {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    overflow: hidden;
    background: #ffffff;
    border: 2px solid var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.b2-logo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.b2-logo-placeholder {
    font-family: 'Noto Serif', serif;
    font-style: italic;
    font-weight: 700;
    font-size: 18px;
    color: var(--primary-dark);
}

.b2-salon-label {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 2px;
}

.b2-salon-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-dark);
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.summary-item .label {
    font-size: 9px;
    font-weight: 700;
    color: #888;
    letter-spacing: 0.5px;
}

.summary-item .value {
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
}

.summary-item .price {font-size: 14px;}

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e0ddd5;
    padding-top: 20px;
    margin-top: 20px;
}

.summary-total span:first-child {
    font-size: 11px;
    font-weight: 700;
    color: #555;
}

.total-price {
    font-size: 24px;
    font-family: 'Playfair Display', serif;
    color: var(--primary-dark);
}

/*BACK BUTTON*/
.navigation-row {
    grid-column: 1 / -1;
    margin-bottom: 20px;
}

.back-btn {
    background: none;
    border: none;
    color: #757575; 
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    transition: color 0.3s ease;
}

.back-btn:hover {color: #074533; }

.back-btn .arrow {font-size: 16px; }

/*FOR LOADING*/
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease;
}

/* State when active */
.loading-overlay.active {
    opacity: 1;
    visibility: visible;
}

.loading-content {
    text-align: center;
    width: 300px;
}

.logo-loading {
    font-family: 'Noto Serif', serif;
    font-size: 26px;
    font-style: italic;
    letter-spacing: 5px;
    color: #074533;
    margin-bottom: 15px;
}

.loader-bar-container {
    width: 100%;
    height: 2px;
    background-color: #E5E7EB;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
}

/* progress bar */
.loader-bar-progress {
    position: absolute;
    height: 100%;
    width: 40%; 
    background-color: #074533;
    animation: loading-animation 1.5s infinite linear;
}

@keyframes loading-animation {
    0% { left: -40%; }
    100% { left: 100%; }
}

.loading-text {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    letter-spacing: 2px;
    color: #A8A29E;
    text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
    .content-layout {
        flex-direction: column-reverse; 
        gap: 30px;
    }

    .booking-summary {
        width: 100%;
        padding: 20px;
    }

    .personal-details-form {
        width: 100%;
    }

    .input-row {
        flex-direction: column; 
        gap: 0;
    }

    .section-title {
        font-size: 26px;
    }

    .booking-header {
        display: none !important;
    }

    .mobile-header {
        display: flex;
    }
    
    #title {
        margin-top: 20px;
        font-size: 22px;
    }
}

/*FOR HEADER*/
.mobile-header {
    display: none;
    background-color: #F3F4F6; 
    padding: 20px;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1px solid #E5E7EB;
}

.mobile-header .logo-text {
    font-family: 'Noto Serif', serif;
    font-size: 24px;
    letter-spacing: 4px;
    color: #074533; 
    text-transform: uppercase;
}

.mobile-header .menu-icon {
    position: absolute;
    left: 20px;
    font-size: 24px;
    color: #074533;
    cursor: pointer;
}
`;

export default function B2({ bookingData = {}, salonProfile = {}, onBack, onNext }) {
    // 1. Form state
    const [formData, setFormData] = useState({
        first_name: bookingData.first_name || '',
        last_name: bookingData.last_name || '',
        email: bookingData.email || '',
        phone: bookingData.phone || '',
        special_requests: bookingData.special_requests || '',
        terms_agreed: false
    });

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Force light mode on the HTML root, same as B1. Without this, if the
    // browser/app ever applied Tailwind's 'dark' class to <html>, B2 would
    // inherit the app layout's `dark:bg-black` and render a solid black page.
    useLayoutEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    // 2. Extract Salon & Booking details
    const salonName = salonProfile.salon_name || 'DivaBook';
    const salonLogo = salonProfile.logo_path || '';
    const brandPrimary = salonProfile.color_primary || '#064E3B';
    const brandSecondary = salonProfile.color_secondary || '#7cbf7f';

    const serviceName = bookingData.serviceName || 'Selected Treatment';
    const servicePrice = Number(bookingData.servicePrice || 0);
    const sizePrice = Number(bookingData.sizePrice || 0);
    const addonPrice = Number(bookingData.addonPrice || 0);
    const removalPrice = Number(bookingData.removalPrice || 0);
    const totalPrice = Number(bookingData.totalPrice || servicePrice + sizePrice + addonPrice + removalPrice);
    
    const dateTimeString = (bookingData.selected_date && bookingData.selected_time)
        ? `${bookingData.selected_date} @ ${bookingData.selected_time}`
        : 'Not scheduled';

    // 3. Input change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 4. Form validation & submit logic
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = [];

        if (!formData.first_name.trim() || !formData.last_name.trim()) {
            newErrors.push("Full name is required.");
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.push("A valid email is required.");
        }
        if (formData.phone.replace(/\D/g, '').length !== 10) {
            newErrors.push("Phone number must be exactly 10 digits.");
        }
        if (!formData.terms_agreed) {
            newErrors.push("You must agree to the Booking Policies.");
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors([]);
        setIsLoading(true);

        // Simulate transition delay to P1
        setTimeout(() => {
            const updatedBooking = { ...bookingData, ...formData };
            if (onNext) {
                onNext(updatedBooking); // Call parent switcher to go to P1
            } else {
                console.log("Proceeding to P1 with data:", updatedBooking);
            }
        }, 1200);
    };

    const handleBackClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (onBack) onBack();
        }, 800);
    };

    return (
        <div className="container" style={{
            '--primary-dark': brandPrimary,
            '--brand-secondary': brandSecondary
        }}>
            <style>{styles}</style>

            {/* Loading Overlay */}
            <div className={`loading-overlay ${isLoading ? 'active' : ''}`}>
                <div className="loading-content">
                    <h1 className="logo-loading">DIVABOOK</h1>
                    <div className="loader-bar-container">
                        <div className="loader-bar-progress"></div>
                    </div>
                    <p className="loading-text">PROCEEDING TO PAYMENT...</p>
                </div>
            </div>

            <h1 id="title">PERSONAL INFORMATION</h1>

            <section className="booking-flow">
                <div className="navigation-row">
                    <button type="button" className="back-btn" onClick={handleBackClick}>
                        <span className="arrow">←</span> BACK
                    </button>
                </div>

                <div className="progress-container">
                    <div className="progress-step active">
                        <span className="step-label">STEP 2 OF 3</span>
                    </div>
                </div>

                <div className="content-layout">
                    {/* Main Form Section */}
                    <form className="personal-details-form" onSubmit={handleSubmit}>
                        {errors.length > 0 && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '15px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                                <strong style={{ display: 'block', marginBottom: '5px' }}>Please fix the following:</strong>
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                                </ul>
                            </div>
                        )}

                        <h2 className="section-title">Tell us about yourself</h2>
                        
                        <div className="input-row">
                            <div className="input-group">
                                <label>FIRST NAME</label>
                                <input 
                                    type="text" 
                                    name="first_name" 
                                    placeholder="First Name" 
                                    value={formData.first_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label>LAST NAME</label>
                                <input 
                                    type="text" 
                                    name="last_name" 
                                    placeholder="Last Name" 
                                    value={formData.last_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>EMAIL ADDRESS</label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label>PHONE NUMBER</label>
                            <div className="phone-input">
                                <span className="country-code">+63</span>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    placeholder="9XXXXXXXXX" 
                                    value={formData.phone} 
                                    maxLength="10"
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setFormData(prev => ({ ...prev, phone: val }));
                                    }}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>SPECIAL REQUESTS</label>
                            <textarea 
                                name="special_requests" 
                                placeholder="Let us know about any allergies or preferences..."
                                value={formData.special_requests}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="marketing-opt-in">
                            <input 
                                type="checkbox" 
                                name="terms_agreed" 
                                id="terms" 
                                checked={formData.terms_agreed} 
                                onChange={handleChange} 
                                required 
                            />
                            <label htmlFor="terms">I agree to the Terms and Conditions and Booking Policies.</label>
                        </div>

                        <button type="submit" className="cta-button">CONTINUE TO PAYMENT</button>
                        <p className="secure-footer">SECURE CHECKOUT POWERED BY DIVABOOK</p>
                    </form>

                    {/* Booking Summary Sidebar */}
                    <aside className="booking-summary">
                        <div className="salon-identity-bar">
                            <div className="b2-logo-wrap">
                                {salonLogo ? (
                                    <img src={salonLogo} alt={`${salonName} Logo`} />
                                ) : (
                                    <span className="b2-logo-placeholder">
                                        {salonName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="b2-salon-label">Service Provider</p>
                                <p className="b2-salon-name">{salonName}</p>
                            </div>
                        </div>

                        <h3>Booking Summary</h3>
                        
                        <div className="summary-item">
                            <div>
                                <span className="label">TREATMENT</span>
                                <p className="value" style={{ fontWeight: 600 }}>{serviceName}</p> 
                            </div>
                            <span className="price">₱{servicePrice.toFixed(2)}</span>
                        </div>
                        
                        {addonPrice > 0 && (
                            <div className="summary-item" style={{ marginTop: '-10px' }}>
                                <div><p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ Design Addon</p></div>
                                <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{addonPrice.toFixed(2)}</span>
                            </div>
                        )}

                        {sizePrice > 0 && (
                            <div className="summary-item" style={{ marginTop: '-10px' }}>
                                <div><p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ Base Coat / Size</p></div>
                                <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{sizePrice.toFixed(2)}</span>
                            </div>
                        )}
                        
                        {removalPrice > 0 && (
                            <div className="summary-item" style={{ marginTop: '-10px' }}>
                                <div><p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ Removal</p></div>
                                <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{removalPrice.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="summary-item">
                            <div>
                                <span className="label">DATE & TIME</span>
                                <p className="value">{dateTimeString}</p>
                            </div>
                        </div>
                        
                        <div className="summary-total">
                            <span>TOTAL</span>
                            <span className="total-price">₱{totalPrice.toFixed(2)}</span>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}