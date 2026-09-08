import React, { useState, useLayoutEffect, useEffect } from 'react';
import { router } from '@inertiajs/react';

const styles = `
:root {
    --primary-dark: #074533;
    --text-main: #333333;
    --text-muted: #757575;
    --bg-light: #FAFAF9;
    --border-color: #e0e0e0;
}

* { 
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body { 
    background-color: #FFFFFF; 
    font-family: 'Inter', sans-serif;
    color: var(--text-main);
    margin: 0;
    overflow-x: hidden;
}

.container {
    max-width: 800px;
    margin: 40px auto;
    padding: 0 20px;
}

.content-layout {
    display: flex;
    justify-content: center; 
    align-items: flex-start;
    gap: 50px; 
    max-width: 1100px;
    margin: 40px auto;
}

.payment-selection {
    flex: 1; 
    max-width: 600px;
}

.section-title { font-family: 'Playfair Display', serif; font-size: 32px; margin-bottom: 10px; }
.section-subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 40px; }
.method-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; margin-bottom: 20px; color: #888; }

.payment-method-card {
    border: 1.5px solid rgba(var(--brand-primary-rgb), 0.28) !important;
    background: rgba(var(--brand-primary-rgb), 0.08) !important;
    margin-bottom: 15px;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.payment-method-card input[type="radio"] {
    display: none;
}

.method-header {
    display: flex;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: var(--brand-primary);
}

.payment-method-card input[type="radio"]:checked ~ .method-header {
    border-color: var(--brand-primary) !important;
}

.radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid var(--brand-primary) !important;
    border-radius: 50%;
    margin-right: 15px;
    position: relative;
    transition: border-color 0.3s;
}

.method-details {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
    padding: 0 25px;
    background: #fff;
}

input[type="radio"]:checked ~ .method-details {
    max-height: 1000px;
    padding: 20px 25px 30px 25px;
    transition: max-height 1s ease-in-out;
}

input[type="radio"]:checked + .method-header .radio-circle::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--brand-primary) !important;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.input-group { margin-bottom: 20px; }
label { font-size: 9px; font-weight: 700; color: #A8A29E; margin-bottom: 8px; display: block; }
input[type="text"], .file-input {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    outline: none;
    background: transparent;
}

.qr-container {
    text-align: center;
    background-color: #fcfcfc;
    border: 1px solid #f0f0f0;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}

.instruction { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
.qr-image { width: 180px; height: 180px; object-fit: contain; border: 4px solid #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

.file-input {
    border: 1px dashed var(--border-color) !important;
    padding: 15px !important;
    background: #fafafa;
    cursor: pointer;
    font-size: 12px;
}

.cta-button {
    width: 100%;
    background: var(--brand-secondary) !important;
    border: 1px solid var(--brand-secondary) !important;
    color: white;
    padding: 18px;
    margin-top: 25px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s;
}

.cta-button:hover { 
    background: rgba(var(--brand-secondary-rgb), 0.82) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--brand-secondary-rgb), 0.35);
}

.secure-footer {
    text-align: center;
    font-size: 10px;
    color: #999;
    margin-top: 20px;
    letter-spacing: 0.5px;
}

.back-btn { background: none; border: none; font-size: 11px; font-weight: 600; color: var(--text-muted); cursor: pointer; letter-spacing: 1px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; padding: 0; }
.back-btn:hover { color: var(--brand-primary); }
.back-btn .arrow { font-size: 16px; }

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000; 
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease;
}

.loading-overlay.active { opacity: 1; visibility: visible; }

.loading-content { text-align: center; width: 100%; max-width: 400px; }
.logo-loading { font-family: 'Noto Serif', serif; font-style: italic; font-weight: 700; letter-spacing: 4px; color: var(--brand-primary); margin-bottom: 20px; font-size: 32px; }
.loader-bar-container { width: 80%; height: 2px; background-color: #e0e0e0; margin: 0 auto 15px auto; position: relative; overflow: hidden; }
.loader-bar-progress { width: 30%; height: 100%; background-color: var(--brand-primary); position: absolute; animation: loadingAnim 1.5s infinite ease-in-out; }
.loading-text { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 2px; color: #9e9e9e; text-transform: uppercase; }

@keyframes loadingAnim {
    0% { left: -30%; }
    100% { left: 100%; }
}

.booking-summary {
    width: 380px;
    background: rgba(var(--brand-primary-rgb), 0.16) !important;
    border: 1.5px solid rgba(var(--brand-primary-rgb), 0.35) !important;
    border-radius: 12px;
    padding: 30px;
}

.booking-summary h3 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; margin-bottom: 25px; }
.summary-item { display: flex; justify-content: space-between; margin-bottom: 20px; }
.summary-item .label { font-size: 9px; font-weight: 700; color: #888; letter-spacing: 0.5px; }
.summary-item .value { font-size: 14px; font-weight: 400; margin-top: 4px; }
.summary-item .price { font-size: 14px; }

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e0ddd5;
    padding-top: 20px;
    margin-top: 20px;
    background: rgba(var(--brand-primary-rgb), 0.16) !important;
    border-radius: 8px;
    padding: 15px;
}

.summary-total span:first-child { font-size: 11px; font-weight: 700; color: #555; }
.total-price { font-size: 24px; font-family: 'Playfair Display', serif; color: var(--brand-primary); }   

.progress-container { display: flex; border-bottom: 2px solid #eeeeee; margin-bottom: 50px; }
.progress-step { flex: 1; padding-bottom: 10px; }
.progress-step.active { border-bottom: 3px solid var(--brand-primary); }
.step-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; color: var(--text-muted); }
.progress-step.active .step-label { color: var(--brand-primary) !important; }

.payment-strategy-container { display: flex; gap: 15px; margin-bottom: 30px; }
.strategy-card {
    flex: 1;
    padding: 15px;
    border: 1px solid rgba(var(--brand-primary-rgb), 0.30) !important;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;
}

input[name="payment_strategy"]:checked + .strategy-card {
    border-color: var(--brand-primary) !important;
    background: rgba(var(--brand-primary-rgb), 0.12) !important;
}

.strategy-title { display: block; font-weight: 700; font-size: 14px; color: var(--brand-primary); }
.strategy-desc { font-size: 11px; color: var(--text-muted); }

.modal-overlay {
    position: fixed; 
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); 
    display: flex; justify-content: center; align-items: center;
    z-index: 10001; 
}
.modal-content {
    background: #ffffff;
    padding: 50px 40px;
    border-radius: 8px;
    text-align: center;
    max-width: 450px; width: 90%;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}
.success-icon { font-size: 60px; color: var(--brand-primary); margin-bottom: 20px; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 10px; color: #1a1a1a; }
.modal-message { font-size: 16px; font-weight: 600; margin-bottom: 5px; color: #333; }
.modal-subtext { font-size: 14px; color: #666; margin-bottom: 20px; }
.modal-close-btn {
    margin-top: 30px; background: #1a1a1a; color: white; border: none; padding: 15px 40px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: background 0.3s;
}
.modal-close-btn:hover { background: var(--brand-primary); }

@media (max-width: 900px) {
    .content-layout { flex-direction: column-reverse; align-items: center; gap: 40px; }
    .payment-selection, .booking-summary { width: 100%; max-width: 100%; }
    .qr-image { width: 150px; height: 150px; }
    .section-title, .section-subtitle { text-align: center; }
}
`;

const hexToRgbStr = (hex = '#000000') => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
};

export default function P1({ bookingData = {}, salonProfile = {}, onBack, onSubmit, onGoHome }) {
    const brandPrimary = salonProfile.color_primary || '#064E3B';
    const brandSecondary = salonProfile.color_secondary || '#7cbf7f';
    const primaryRgb = hexToRgbStr(brandPrimary);
    const secondaryRgb = hexToRgbStr(brandSecondary);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
    }, []);

    useLayoutEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    const serviceName = bookingData.serviceName || 'Selected Treatment';
    const servicePrice = Number(bookingData.servicePrice || 0);
    const sizePrice = Number(bookingData.sizePrice || 0);
    const addonName = bookingData.addonName || '';
    const addonPrice = Number(bookingData.addonPrice || 0);
    const removalPrice = Number(bookingData.removalPrice || 0);
    const baseTotal = servicePrice + sizePrice + addonPrice + removalPrice;

    const dateTimeString = (bookingData.selected_date && bookingData.selected_time)
        ? `${bookingData.selected_date}\n${bookingData.selected_time}`
        : 'Not scheduled';

    const [paymentStrategy, setPaymentStrategy] = useState('downpayment');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [formInputs, setFormInputs] = useState({
        gcash_name: '', gcash_receipt: null,
        maya_name: '', maya_receipt: null,
        shopee_name: '', shopee_receipt: null
    });
    
    const [errors, setErrors] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showNoPaymentPopup, setShowNoPaymentPopup] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormInputs(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleBackClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (onBack) onBack();
        }, 800);
    };

    // NEW SUBMIT
const handleFormSubmit = (e) => {
    e.preventDefault();
    const prefix = paymentMethod === 'paymaya' ? 'maya' : (paymentMethod === 'shopeepay' ? 'shopee' : 'gcash');
    const activeName = formInputs[`${prefix}_name`];
    const activeReceipt = formInputs[`${prefix}_receipt`];

    setIsLoading(true);

    router.post('/bookings', {
        ...bookingData,
        paymentStrategy,
        paymentMethod,
        amountPaid: paymentStrategy === 'full' ? baseTotal : 450,
        senderName: activeName,
        receiptFile: activeReceipt
    }, {
        forceFormData: true,
        onSuccess: () => {
            setIsLoading(false);
            setShowSuccessModal(true);
        },
        onError: (errs) => {
            setIsLoading(false);
            setErrors(Object.values(errs));
        }
    });
};

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        if (onGoHome) {
            onGoHome();
        } else {
            router.visit('/');
        }
    };

    return (
        <div className="container" style={{
            '--brand-primary': brandPrimary,
            '--brand-secondary': brandSecondary,
            '--brand-primary-rgb': primaryRgb,
            '--brand-secondary-rgb': secondaryRgb,
        }}>
            <style>{styles}</style>

            <div className={`loading-overlay ${isLoading ? 'active' : ''}`}>
                <div className="loading-content">
                    <h1 className="logo-loading">DIVABOOK</h1>
                    <div className="loader-bar-container">
                        <div className="loader-bar-progress"></div>
                    </div>
                    <p className="loading-text">PROCESSING...</p>
                </div>
            </div>

            <div className="navigation-row">
                <button type="button" className="back-btn" onClick={handleBackClick}>
                    <span className="arrow">←</span> BACK
                </button>
            </div>

            <div className="progress-container">
                <div className="progress-step active">
                    <span className="step-label">STEP 3 OF 3</span>
                </div>
            </div>

            <div className="content-layout">
                <div className="payment-selection">
                    <h2 className="section-title">Checkout</h2>
                    <p className="section-subtitle">Choose your preferred payment method and upload your proof of payment.</p>

                    <p className="method-label">PAYMENT STRATEGY</p>
                    <div className="payment-strategy-container">
                        <input 
                            type="radio" name="payment_strategy" id="pay_downpayment" 
                            value="downpayment" 
                            checked={paymentStrategy === 'downpayment'}
                            onChange={(e) => setPaymentStrategy(e.target.value)}
                            style={{ display: 'none' }} 
                        />
                        <label htmlFor="pay_downpayment" className="strategy-card">
                            <span className="strategy-title">Downpayment</span>
                            <span className="strategy-desc">Pay ₱450.00 now to secure slot</span>
                        </label>

                        <input 
                            type="radio" name="payment_strategy" id="pay_full" 
                            value="full" 
                            checked={paymentStrategy === 'full'}
                            onChange={(e) => setPaymentStrategy(e.target.value)}
                            style={{ display: 'none' }} 
                        />
                        <label htmlFor="pay_full" className="strategy-card">
                            <span className="strategy-title">Full Payment</span>
                            <span className="strategy-desc">Pay the total amount now</span>
                        </label>
                    </div>

                    <p className="method-label">SELECT PAYMENT METHOD</p>

                    {errors.length > 0 && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '15px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                            <strong style={{ display: 'block', marginBottom: '5px' }}>Please fix the following:</strong>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit}>
                        <div className="payment-method-card">
                            <input 
                                type="radio" name="payment_method" id="gcash" 
                                value="gcash" 
                                checked={paymentMethod === 'gcash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="gcash" className="method-header">
                                <div className="radio-circle"></div>
                                <span>GCash</span>
                            </label>
                            <div className="method-details">
                                <div className="qr-container">
                                    <p className="instruction">Scan the QR code below to pay via GCash</p>
                                    <img src="/qr/gcash.png" alt="GCash QR Code" className="qr-image" />
                                </div>
                                <div className="input-group">
                                    <label>SENDER NAME</label>
                                    <input type="text" name="gcash_name" placeholder="Name on GCash Account" value={formInputs.gcash_name} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>UPLOAD RECEIPT</label>
                                    <input type="file" name="gcash_receipt" className="file-input" accept="image/*" onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="payment-method-card">
                            <input 
                                type="radio" name="payment_method" id="paymaya" 
                                value="paymaya" 
                                checked={paymentMethod === 'paymaya'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="paymaya" className="method-header">
                                <div className="radio-circle"></div>
                                <span>PayMaya</span>
                            </label>
                            <div className="method-details">
                                <div className="qr-container">
                                    <p className="instruction">Scan the QR code below to pay via PayMaya</p>
                                    <img src="/qr/maya.png" alt="PayMaya QR Code" className="qr-image" />
                                </div>
                                <div className="input-group">
                                    <label>SENDER NAME</label>
                                    <input type="text" name="maya_name" placeholder="Name on Maya Account" value={formInputs.maya_name} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>UPLOAD RECEIPT</label>
                                    <input type="file" name="maya_receipt" className="file-input" accept="image/*" onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="payment-method-card">
                            <input 
                                type="radio" name="payment_method" id="shopeepay" 
                                value="shopeepay" 
                                checked={paymentMethod === 'shopeepay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="shopeepay" className="method-header">
                                <div className="radio-circle"></div>
                                <span>ShopeePay</span>
                            </label>
                            <div className="method-details">
                                <div className="qr-container">
                                    <p className="instruction">Scan the QR code below to pay via ShopeePay</p>
                                    <img src="/qr/spay.png" alt="ShopeePay QR Code" className="qr-image" />
                                </div>
                                <div className="input-group">
                                    <label>SENDER NAME</label>
                                    <input type="text" name="shopee_name" placeholder="Name on ShopeePay Account" value={formInputs.shopee_name} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>UPLOAD RECEIPT</label>
                                    <input type="file" name="shopee_receipt" className="file-input" accept="image/*" onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="cta-button">CONFIRM AND PAY</button>
                    </form>
                    <p className="secure-footer">🔒 SECURE ENCRYPTED PAYMENT</p>
                </div>

                <aside className="booking-summary">
                    <h3>Booking Summary</h3>
                    
                    <div className="summary-item">
                        <div>
                            <span className="label">TREATMENT</span>
                            <p className="value" style={{ fontWeight: 600 }}>{serviceName}</p> 
                        </div>
                        <span className="price">₱{servicePrice.toFixed(2)}</span>
                    </div>
                    
                    {addonName.toLowerCase() === 'heavy' ? (
                        <div className="summary-item" style={{ marginTop: '-10px' }}>
                            <div>
                                <p className="value" style={{ fontSize: '0.9em', color: '#6b7280', marginRight: '73px' }}>
                                    + Hard Design - Rates may vary based on design complexity.
                                </p>
                            </div>
                            <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>TBD</span>
                        </div>
                    ) : (
                        addonPrice > 0 && (
                            <div className="summary-item" style={{ marginTop: '-10px' }}>
                                <div>
                                    <p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ {addonName || 'Add-on Design'}</p>
                                </div>
                                <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{addonPrice.toFixed(2)}</span>
                            </div>
                        )
                    )}

                    {sizePrice > 0 && (
                        <div className="summary-item" style={{ paddingTop: 0, borderTop: 'none', marginTop: '-10px' }}>
                            <div>
                                <p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ Ext. Size Upgrade</p>
                            </div>
                            <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{sizePrice.toFixed(2)}</span>
                        </div>
                    )}
                    
                    {removalPrice > 0 && (
                        <div className="summary-item" style={{ paddingTop: 0, borderTop: 'none', marginTop: '-10px' }}>
                            <div>
                                <p className="value" style={{ fontSize: '0.9em', color: '#6b7280' }}>+ Removal</p>
                            </div>
                            <span className="price" style={{ fontSize: '0.9em', color: '#6b7280' }}>₱{removalPrice.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="summary-item">
                        <div>
                            <span className="label">DATE & TIME</span>
                            <p className="value" style={{ whiteSpace: 'pre-line' }}>{dateTimeString}</p>
                        </div>
                    </div>

                    <div className="summary-total">
                        <span>TOTAL TO PAY NOW</span>
                        <span className="total-price">
                            {paymentStrategy === 'downpayment' ? '₱450.00' : `₱${baseTotal.toFixed(2)}`}
                        </span>
                    </div>
                </aside>

                {showNoPaymentPopup && (
                    <div id="no-payment-popup" className="modal-overlay">
                        <div className="modal-content">
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', margin: '0 0 10px', color: '#1a1a1a' }}>
                                No Payment Method Selected
                            </h3>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#6b7280', margin: '0 0 24px' }}>
                                Please choose a payment method (GCash, PayMaya, or ShopeePay) before proceeding.
                            </p>
                            <button 
                                onClick={() => setShowNoPaymentPopup(false)} 
                                style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer' }}
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                )}

                {showSuccessModal && (
                    <div id="confirmation-modal" className="modal-overlay">
                        <div className="modal-content">
                            <div className="success-icon">✓</div>
                            <h2 className="modal-title">Booking Submitted</h2>
                            <p className="modal-message">Please wait for admin confirmation.</p>
                            <p className="modal-subtext">Check your email for your booking status and further updates.</p>
                            <button 
                                type="button" 
                                className="modal-close-btn" 
                                onClick={handleSuccessClose}
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}