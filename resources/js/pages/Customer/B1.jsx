import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';


// ─────────────────────────────────────────────────────────
// SITE HEADER (converted from header.php)
// ─────────────────────────────────────────────────────────
function SiteHeader({ currentPage = null }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLink = (page) => (currentPage === page ? 'active' : 'hover-link');
    const sidebarLink = (page) => (currentPage === page ? 'active' : '');

    return (
        <nav className="navbar">
            <div className="nav-links">
                <a href="../HomePage.php" className={navLink('home')}>HOME</a>
                <a href="../Servicepage4.php" className={navLink('services')}>SERVICES</a>
            </div>

            <div className="logo">
                <a href="../HomePage.php"><i>DIVABOOK</i></a>
            </div>

            <div className="nav-links right">
                <a href="../ContactUs.php" className="hover-link">CONTACT US</a>
                <span className="search-icon">🔍</span>
            </div>

            <div className="hamburger-menu" onClick={() => setMobileOpen(true)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`mobile-sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="close-sidebar" onClick={() => setMobileOpen(false)}>✕</div>
                <a href="../HomePage.php" className={sidebarLink('home')}>HOME</a>
                <a href="../Servicepage4.php" className={sidebarLink('services')}>SERVICES</a>
                <a href="../ContactUs.php">CONTACT US</a>
            </div>
        </nav>
    );
}

// ─────────────────────────────────────────────────────────
// SITE FOOTER (converted from footer.php)
// ─────────────────────────────────────────────────────────
function SiteFooter() {
    return (
        <footer className="main-footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h4>DivaBook</h4>
                    <p>Redefining luxury beauty through seamless technology and expert craftsmanship.</p>
                </div>

                <div className="footer-links">
                    <h5>EXPLORE</h5>
                    <a href="../HomePage.php" className="footer-hover">About Us</a>
                    <a href="../AdminView/Registration.php" className="footer-hover">Partner with Us</a>
                </div>

                <div className="footer-links">
                    <h5>LEGAL</h5>
                    <a href="#" className="footer-hover">Privacy Policy</a>
                    <a href="#" className="footer-hover">Terms of Service</a>
                </div>
            </div>

            <div className="footer-bottom">© 2026 DivaBook. The Luxury of Care.</div>
        </footer>
    );
}

const PRICE_TABLE = {
    service: { 'soft-gel': 850, 'gel-overlay': 550, 'hard-biab': 750, 'soft-biab': 650 },
    size: { xl: 200, standard: 0 },
    addon: { basic: 200, moderate: 500, heavy: 1000 },
    removal: 150,
};

const SERVICE_LABELS = {
    'soft-gel': 'Soft Gel Extension',
    'gel-overlay': 'Gel Overlay',
    'hard-biab': 'Hard BIAB',
    'soft-biab': 'Soft BIAB',
};

export default function B1({ service = {}, salonProfile = {}, onNext, occupiedSlotsMap = {} }) {
    // NEW FOR CSS
    // Force light mode on the HTML root for the whole booking flow.
    // useLayoutEffect (not useEffect) so this runs before paint - no flash of dark.
    // We intentionally do NOT restore the 'dark' class on unmount: this component
    // hands off to B2 next, and B2 expects to stay in light mode too.
    useLayoutEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);


    // 1. Setup Form handling via Inertia
    const { data, setData, post, processing, errors } = useForm({
        selected_date: '',
        selected_time: '09:00 AM',
        service: '0',
        size: '0',
        addon: '0',
        removal: false,
        provider_chooses_design: false,
        reference_image: null,
    });

    // 2. Local State for UI
    const [policyAgreed, setPolicyAgreed] = useState(false);
    const [showPolicy, setShowPolicy] = useState(true);
    const [previewImg, setPreviewImg] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Salon branding details
    const salonName = salonProfile.salon_name || 'DivaBook';
    const salonLogo = salonProfile.logo_path || '';
    const salonLocation = salonProfile.location || 'MTS, Davao City, Philippines';
    const brandPrimary = salonProfile.color_primary || '#064E3B';
    const brandSecondary = salonProfile.color_secondary || '#7cbf7f';

    // 3. Dynamic Price Calculation
    useEffect(() => {
        let total = 0;
        if (PRICE_TABLE.service[data.service]) total += PRICE_TABLE.service[data.service];
        if (PRICE_TABLE.size[data.size]) total += PRICE_TABLE.size[data.size];
        if (PRICE_TABLE.addon[data.addon]) total += PRICE_TABLE.addon[data.addon];
        if (data.removal) total += PRICE_TABLE.removal;

        setTotalPrice(total);
    }, [data.service, data.size, data.addon, data.removal]);

    // Convert brand hex colors to "r, g, b" so they can be used with rgba()
    const hexToRgb = (hex) => {
        let h = (hex || '').replace('#', '');
        if (h.length === 3) h = h.split('').map((c) => c + c).join('');
        if (h.length !== 6) return '6, 78, 59';
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };
    const primaryRgb = hexToRgb(brandPrimary);
    const secondaryRgb = hexToRgb(brandSecondary);

    // 4. Calendar Logic
    const calYear = currentMonth.getFullYear();
    const calMonth = currentMonth.getMonth();

    const isDateSelectable = (y, m, d) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const candidate = new Date(y, m, d);
        candidate.setHours(0, 0, 0, 0);
        return candidate >= today;
    };

    const isToday = (y, m, d) => {
        const now = new Date();
        return now.getFullYear() === y && now.getMonth() === m && now.getDate() === d;
    };

    const handlePrevMonth = () => {
        const today = new Date();
        const proposed = new Date(calYear, calMonth - 1, 1);
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        if (proposed >= thisMonthStart) setCurrentMonth(proposed);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(calYear, calMonth + 1, 1));
    };

    const renderCalendarDays = () => {
        const firstDay = new Date(calYear, calMonth, 1).getDay();
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const monthShort = new Date(calYear, calMonth, 1).toLocaleDateString('en-US', { month: 'short' });
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="day muted"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateId = `${monthShort} ${d}, ${calYear}`;
            const selectable = isDateSelectable(calYear, calMonth, d);
            const today = isToday(calYear, calMonth, d);
            const isActive = data.selected_date === dateId;

            if (!selectable) {
                cells.push(
                    <div
                        key={dateId}
                        className="day muted"
                        style={{ cursor: 'not-allowed', opacity: 0.28, textDecoration: 'line-through', pointerEvents: 'none' }}
                    >
                        {d}
                    </div>
                );
            } else {
                cells.push(
                    <div
                        key={dateId}
                        className={`day ${isActive ? 'active' : ''}`}
                        style={today ? { outline: '2px solid currentColor', outlineOffset: '-3px', fontWeight: 700 } : undefined}
                        onClick={() => setData('selected_date', dateId)}
                    >
                        {d}
                    </div>
                );
            }
        }

        return cells;
    };

    // 5. Time Slot Availability
    const slotToMinutes = (label) => {
        const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        if (period === 'AM' && hours === 12) hours = 0;
        if (period === 'PM' && hours !== 12) hours += 12;
        return hours * 60 + mins;
    };

    const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const effectiveDate = data.selected_date || todayFormatted;
    const bookedForDate = occupiedSlotsMap[effectiveDate] || [];

    const isSlotAvailable = (slotLabel) => {
        if (bookedForDate.includes(slotLabel)) return false;
        if (effectiveDate !== todayFormatted) return true;
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return slotToMinutes(slotLabel) > nowMinutes + 30;
    };

    // Auto pick the first available slot whenever the selected date (or booked map) changes
    useEffect(() => {
        const slotsList = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'];
        const available = slotsList.filter((s) => isSlotAvailable(s));
        if (!available.includes(data.selected_time)) {
            setData('selected_time', available[0] || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.selected_date]);

    // Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('reference_image', file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('reference_image', null);
        setPreviewImg(null);
    };

    // Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.service === '0') {
            alert('Please select a service.');
            return;
        }
        if (!data.selected_date) {
            alert('Please select a future date on the calendar.');
            return;
        }
        if (data.size === '0') {
            alert('Please select a size option.');
            return;
        }
        if (data.addon === '0') {
            alert('Please select a design add-on.');
            return;
        }
        if (!data.provider_chooses_design && !data.reference_image) {
            alert("Please upload a reference image or check 'Service provider will choose the design'.");
            return;
        }

        post(route('booking.step1.store'));
    };

    const slots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM'];

    return (
        <>
            <Head title={`${salonName} | Book Appointment`} />

            {/* BRANDING CSS VARIABLES */}
            <style>{`
body { 
    background-color: #FAFAF9; 
    margin: 0;   
    padding: 0;  
    font-family: 'Inter', sans-serif;
    overflow-x: hidden; 
}

.booking-wrapper {
    display: grid;
    grid-template-columns: 1.5fr 1fr; 
    gap: 60px; 
    max-width: 1000px; 
    margin: 40px auto;
    padding: 0 20px;
    align-items: flex-start;
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
}

.heading-serif { font-family: 'Noto Serif', serif; 
                 color: #1C1B1B;
                 padding: 0;
                 margin: 0; 
                 font-weight: 400; 
                }

.text-inter { color: #5E5E5D; 
              padding: 5px;
              margin: 0;
              font-size: 15px; 
            }

.left-column { flex: 1.6; }
.right-column { flex: 1; }

.section-title-row { display: flex; 
                     justify-content: space-between; 
                     align-items: center; 
                     margin-bottom: 25px; 
                    }

.step-indicator { font-size: 10px; 
                  font-weight: 600; 
                  color: #715A4C; 
                  letter-spacing: 1px; 
                }

.required-star, 
label.heading-serif::after {
    content: " *"; 
    color: #DC2626; 
    font-weight: bold;
}

.dropdown-container {
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.custom-dropdown {
    border: 1px solid #064E3B; 
    margin-bottom: 15px;
}

.custom-dropdown:focus {
    outline: none;
    border-color: #064E3B; 
    box-shadow: 0 0 5px rgba(6, 78, 59, 0.1);
}

.addon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    gap: 12px;
    margin-top: 15px;
}

.addon-card {
    border: 1px solid #E7E5E4; 
    border-radius: 4px;
    background: #FFFFFF;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 370px;
}

.addon-img-box {
    width: 100%;
    aspect-ratio: 1 / 1; 
    overflow: hidden;
    background: #F3F4F6;
}

.addon-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.addon-info {
    padding: 8px;
    text-align: center;
}

.addon-info h4 {
    font-size: 13px;
    margin-bottom: 2px;
}

.addon-info p {
    font-size: 10px;
    color: #78716C;
    margin: 0;
}

.addon-price {
    display: block;
    font-size: 11px;
    color: #064E3B;
    font-weight: 600;
    margin-top: 4px;
    padding-top: 10%;
}

.upload-container { margin-top: 40px; }
.upload-inner-card { background: #F6F3F2; 
                     padding: 30px; 
                    border-radius: 4px; 
                }

.upload-dropzone { border: 2px dashed #D1D1D1; 
                   min-height: 140px; 
                   margin-top: 15px;
                   display: flex; 
                   flex-direction: column; 
                   justify-content: center; 
                   align-items: center;
                   cursor: pointer; 
                   background-size: cover; 
                   background-position: center;
}

.calendar-card { background: white; 
                 padding: 25px; 
                 border-radius: 4px; 
                 border: 1px solid #F5F5F4; 
                 box-shadow: 0 4px 10px rgba(0,0,0,0.02); 
                }

.calendar-header { display: flex; 
                   justify-content: space-between;
                   margin-bottom: 20px; 
                }
                
.nav-arrow { cursor: pointer; 
             padding: 0 10px; 
             font-weight: bold; 
            }

.calendar-grid { display: grid; 
                 grid-template-columns: repeat(7, 1fr); 
                 gap: 5px; 
                 text-align: center; 
                }
                
.day-label { font-weight: 600; 
             color: #A8A29E; 
             font-size: 11px; 
             padding-bottom: 10px; 
            }

.day { padding: 10px 0; 
       cursor: pointer; 
       border-radius: 4px; 
       font-size: 13px; 
       transition: 0.2s; 
    }

.day.active { background: #064E3B !important; 
              color: white; 
            }

.day.muted { color: #D1D1D1; }

.day:hover:not(.muted) { background: #F0FDF4; }

.slots-grid { display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10px; 
              margin-top: 15px; 
            }

.slot-btn { border: 1px solid #E7E5E4; 
            background: white; 
            padding: 12px; 
            border-radius: 4px; 
            cursor: pointer; 
            color: #064E3B; 
            font-weight: 600; 
        }

.slot-btn.active { border-color: #064E3B; 
                   background: #F0FDF4; 
                }

.summary-section { margin-top: 30px; }

.summary-line { display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 20px; 
            }

.summary-price { font-size: 28px; 
                 color: #064E3B; 
                 font-family: 'Noto Serif', serif; 
                }

.confirm-btn { width: 100%; 
               background: #064E3B; 
               color: white; 
               border: none; 
               padding: 18px; 
               border-radius: 4px; 
               font-weight: 600; 
               cursor: pointer; 
            }

.next-step { text-align: center; 
             font-size: 10px; 
             color: #78716C; 
             margin-top: 15px; 
             text-transform: uppercase; 
             letter-spacing: 1px; 
            }

.upload-dropzone {
    position: relative; 
    overflow: hidden;
}

.delete-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(220, 38, 38, 0.9); 
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: none; 
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    z-index: 10;
}

.upload-dropzone.has-image:hover .delete-btn {
    display: block;
}

.slot-btn {
    border: 1px solid #E7E5E4;
    background: white;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    color: #064E3B;
    font-weight: 600;
    transition: all 0.2s ease;
}

.slot-btn:hover {background-color: #F0FDF4;}

.slot-btn.active {
    background-color: #F0FDF4;
    border-color: #064E3B;
    color: #064E3B;
}

.stepper-container {
    grid-column: 1 / -1; 
    display: flex;
    width: 100%;
    border-bottom: 1px solid #E5E7EB; 
    position: relative;
}

.stepper-item {
    flex: 1;
    padding-bottom: 10px;
    position: relative;
}

.step-label {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #9CA3AF;
    text-transform: uppercase;
    margin-bottom: 5px; 
}

.stepper-item.active .step-line {
    position: absolute;
    bottom: -1px; 
    left: 0;
    width: 75%;
    height: 3px;
    background-color: #074533; 
}

.stepper-item.active .step-label {color: #074533;}

.booking-wrapper {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 40px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

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
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-overlay.active {
    opacity: 1;
    visibility: visible;
}

.loading-content {text-align: center;}

.logo-loading {
    font-family: 'Noto Serif', serif;
    font-size: 24px;
    letter-spacing: 6px;
    color: #074533;
    margin-bottom: 20px;
    font-style: italic;
}

.loader-bar {
    width: 200px;
    height: 2px;
    background-color: #E5E7EB;
    margin: 0 auto 15px auto;
    position: relative;
    overflow: hidden;
}

.loader-bar::after {
    content: '';
    position: absolute;
    left: -100%;
    width: 100%;
    height: 100%;
    background-color: #074533;
    animation: loading-slide 1.5s infinite ease-in-out;
}

@keyframes loading-slide {
    0% { left: -100%; }
    50% { left: 0; }
    100% { left: 100%; }
}

.loading-text {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #757575;
}

.policy-overlay {
    display: none; 
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4); 
    backdrop-filter: blur(8px);
    z-index: 20000;
}

.policy-overlay.active {
    display: flex;
    justify-content: center;
    align-items: center;
}

.policy-modal {
    background-color: #ffffff;
    color: #333;
    max-width: 850px;
    width: 90%;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    border: 1px solid #eee;
}

.policy-heading {
    font-family: 'Noto Serif', serif;
    font-size: 16px;
    color: #00332c; 
    font-weight: 700;
    margin-bottom: 15px;
    border-bottom: 2px solid #00332c;
    padding-bottom: 5px;
    display: inline-block;
}

.policy-list {
    list-style: none;
    padding: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #666;
}

.agreement-container {
    margin-top: 30px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
}

.agreement-text {
    color: #00332c;
    font-weight: 600;
    font-size: 14px;
}

.proceed-btn {
    background-color: #00332c;
    color: white;
    border: none;
    padding: 18px;
    font-weight: 700;
    width: 100%;
    border-radius: 6px;
    margin-top: 20px;
    cursor: pointer;
    transition: 0.3s;
}

.proceed-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.proceed-btn:hover:not(:disabled) {background-color: #004d43;}

.policy-modal-header {
    font-family: 'Playfair Display', serif; 
    font-size: 32px;
    color: #00332c; 
    margin-bottom: 30px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
}

.policy-modal-header::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background-color: #00332c;
    margin: 10px auto 0;
}

.policy-modal {
    position: relative;
    background-color: #ffffff;
    padding: 50px;
    border-radius: 12px;
    max-width: 850px;
    width: 90%;
    margin: auto;
}

.close-x-btn {
    position: absolute; 
    top: 15px;          
    right: 20px;        
    background: none;
    border: none;
    font-size: 28px;
    color: #00332c;     
    cursor: pointer;
    font-family: Arial, sans-serif;
    line-height: 1;
    padding: 5px;
    transition: opacity 0.2s;
}

.close-x-btn:hover {
    color: #004d43;
    transform: scale(1.1);
}

.proceed-btn {
    width: 100%;
    background-color: #00332c;
    color: white;
    border: none;
    padding: 18px;
    font-weight: 700;
    border-radius: 6px;
    margin-top: 20px;
    cursor: pointer;
}

@media screen and (max-width: 768px) {
    .booking-wrapper {
        grid-template-columns: 1fr; 
        gap: 30px;
        padding: 15px;
    }

    #title {
        font-size: 20px;
        letter-spacing: 2px;
        margin-top: 20px;
    }

    .addon-grid {
        grid-template-columns: 1fr; 
        gap: 20px;
    }

    .addon-card {height: auto;}

    .calendar-card {padding: 15px;}

    .slots-grid {grid-template-columns: 1fr 1fr; }

    .policy-modal {
        padding: 20px;
        width: 95%;
    }

    .policy-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .policy-modal-header {font-size: 24px;}

}

.day.active          { background: ${brandPrimary} !important; color: #fff !important; }
.slot-btn.active     { border-color: ${brandPrimary}; color: ${brandPrimary}; background: rgba(0,0,0,0.04); }
.slot-btn            { color: ${brandPrimary}; }
.confirm-btn         { background: ${brandSecondary} !important; }
.confirm-btn:hover   { background: rgba(${secondaryRgb}, 0.82) !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(${secondaryRgb}, 0.35); }
.summary-price       { color: ${brandPrimary}; }
.addon-card.selected { border-color: ${brandPrimary} !important; background: rgba(${primaryRgb}, 0.04); }
.custom-dropdown     { border-color: ${brandPrimary}; }
.stepper-item.active .step-line { background-color: ${brandPrimary}; }
.stepper-item.active .step-label { color: ${brandPrimary}; }

.calendar-card {
    background: rgba(${primaryRgb}, 0.12) !important;
    border: 1.5px solid rgba(${primaryRgb}, 0.30) !important;
    border-radius: 12px;
}
.summary-section {
    background: rgba(${primaryRgb}, 0.16) !important;
    border: 1.5px solid rgba(${primaryRgb}, 0.35) !important;
    border-radius: 12px;
    padding: 20px;
}
.upload-inner-card {
    background: rgba(${primaryRgb}, 0.10) !important;
    border: 1px solid rgba(${primaryRgb}, 0.28) !important;
    border-radius: 10px;
}
.addon-card {
    border: 1.5px solid rgba(${primaryRgb}, 0.28) !important;
    background: rgba(${primaryRgb}, 0.08) !important;
}
.proceed-btn { background: ${brandSecondary} !important; }

.salon-identity { display: flex; align-items: center; gap: 16px; }
.b1-logo-wrap {
    width: 54px; height: 54px; border-radius: 50%; overflow: hidden;
    border: 2.5px solid ${brandPrimary}; background: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.10);
}
.b1-logo-wrap img { width: 100%; height: 100%; object-fit: cover; }
.b1-logo-placeholder {
    font-size: 22px; font-family: 'Noto Serif', serif; font-style: italic;
    font-weight: 700; color: ${brandPrimary};
}
.salon-name-text {
    font-family: 'Noto Serif', serif; font-size: 26px; font-weight: 700;
    color: ${brandPrimary}; margin: 0; line-height: 1.1;
}
.salon-addr-text { font-size: 12px; color: #78716C; letter-spacing: 0.5px; margin: 4px 0 0; }

.slot-occupied,
.slot-selected {
    opacity: 0.45;
    cursor: not-allowed;
    text-decoration: line-through;
    background-color: #d1d5db !important;
    color: #6b7280 !important;
}
.slot-selected { border: 2px solid #ef4444; }

.loading-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: #FFFFFF; display: flex; justify-content: center; align-items: center;
    z-index: 9999; opacity: 0; visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}
.loading-overlay.active { opacity: 1; visibility: visible; }
.loading-content { text-align: center; }
.logo-loading {
    font-family: 'Noto Serif', serif; font-size: 24px; letter-spacing: 6px;
    color: #074533; margin-bottom: 20px; font-style: italic;
}
.loader-bar {
    width: 200px; height: 2px; background-color: #E5E7EB;
    margin: 0 auto 15px auto; position: relative; overflow: hidden;
}
.loader-bar::after {
    content: ''; position: absolute; left: -100%; width: 100%; height: 100%;
    background-color: #074533; animation: loading-slide 1.5s infinite ease-in-out;
}
@keyframes loading-slide {
    0% { left: -100%; }
    50% { left: 0; }
    100% { left: 100%; }
}
.loading-text {
    font-family: 'Inter', sans-serif; font-size: 12px; text-transform: uppercase;
    letter-spacing: 2px; color: #757575;
}

.navbar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 25px 5% !important;
    background: #14532d !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 100 !important;
    font-family: 'Inter', sans-serif !important;
    box-sizing: border-box !important;
}
.navbar * { box-sizing: border-box !important; }
.logo a {
    text-decoration: none !important;
    color: #F9F8F6 !important;
    font-family: 'Crimson Pro', serif !important;
    font-size: 32px !important;
    letter-spacing: 2px !important;
}
.nav-links a {
    text-decoration: none !important;
    color: #ffffff !important;
    font-size: 13px !important;
    margin-right: 30px !important;
    letter-spacing: 1.5px !important;
    transition: color 0.3s !important;
    border-bottom: 2px solid transparent !important;
}
.nav-links a.active { color: #0C0A09 !important; border-bottom: 2px solid #0C0A09 !important; }
.nav-links a.hover-link:hover { color: #064E3B !important; }
.nav-links.right { display: flex !important; align-items: center !important; }
.search-icon { color: #ffffff !important; cursor: pointer !important; }
.hamburger-menu { display: none !important; }
.mobile-sidebar { display: none !important; }

@media screen and (max-width: 768px) {
    .navbar {
        display: flex !important;
        flex-direction: row !important;
        justify-content: flex-end !important;
        align-items: center !important;
        height: 70px !important;
        padding: 0 6% !important;
        position: relative !important;
    }
    .logo {
        position: absolute !important; left: 50% !important; top: 50% !important;
        transform: translate(-50%, -50%) !important;
        display: flex !important; align-items: center !important;
        height: auto !important; margin: 0 !important; padding: 0 !important; z-index: 105 !important;
    }
    .logo a { font-size: 24px !important; line-height: 1 !important; white-space: nowrap !important; }
    .nav-links, .nav-links.right { display: none !important; }
    .hamburger-menu {
        display: flex !important; flex-direction: column !important; justify-content: space-between !important;
        width: 24px !important; height: 16px !important; cursor: pointer !important; z-index: 110 !important; color: #ffffff !important;
    }
    .hamburger-menu span { display: block !important; height: 2px !important; width: 100% !important; background-color: #ffffff !important; transition: 0.3s !important; }
    .mobile-sidebar {
        display: flex !important; flex-direction: column !important; position: fixed !important;
        top: 0 !important; right: -100% !important; width: 80% !important; max-width: 300px !important;
        height: 100vh !important; background-color: #F9F8F6 !important;
        box-shadow: -10px 0 30px rgba(0,0,0,0.1) !important; padding: 80px 40px !important;
        gap: 25px !important; z-index: 120 !important; transition: right 0.4s ease-in-out !important;
    }
    .mobile-sidebar.open { right: 0 !important; }
    .mobile-sidebar a {
        text-decoration: none !important; color: #44403C !important; font-size: 18px !important;
        letter-spacing: 1.5px !important; font-weight: 500 !important; transition: color 0.3s !important; border: none !important;
    }
    .mobile-sidebar a.active, .mobile-sidebar a:hover { color: #064E3B !important; }
    .close-sidebar { position: absolute !important; top: 22px !important; right: 24px !important; font-size: 28px !important; cursor: pointer !important; color: #0C0A09 !important; }
}

.main-footer {
    background: #F5F5F4;
    padding: 80px 5% 30px !important;
    font-family: 'Inter', sans-serif !important;
    box-sizing: border-box !important;
}
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
.footer-brand h4 {
    font-family: 'Crimson Pro', serif !important; font-size: 24px !important;
    margin-bottom: 15px !important; color: #064E3B !important; margin-top: 0;
}
.footer-brand p { color: #44403C !important; max-width: 300px; font-size: 14px !important; line-height: 1.6; }
.footer-links h5 {
    font-size: 12px !important; letter-spacing: 2px !important; margin-bottom: 20px !important;
    color: #0C0A09 !important; text-transform: uppercase;
}
.footer-hover {
    display: block !important; text-decoration: none !important; color: rgba(6, 78, 59, 0.7) !important;
    margin-bottom: 10px !important; font-size: 14px !important; transition: 0.3s !important;
}
.footer-hover:hover { color: #064E3B !important; padding-left: 5px !important; }
.footer-bottom {
    margin-top: 60px !important; padding-top: 20px !important; border-top: 1px solid #E7E5E4 !important;
    text-align: center !important; font-size: 12px !important; color: #78716C !important;
}
@media screen and (max-width: 768px) {
    .main-footer { padding: 40px 5% 30px !important; }
    .footer-grid { display: flex !important; flex-direction: column !important; gap: 32px !important; text-align: left !important; }
    .footer-brand p { max-width: 100% !important; }
    .footer-bottom { text-align: left !important; margin-top: 40px !important; }
}

            `}</style>

            {/* HEADER / NAVBAR */}
            <SiteHeader currentPage={null} />

            {/* LOADING OVERLAY (shown while the booking is being submitted) */}
            <div className={`loading-overlay ${processing ? 'active' : ''}`}>
                <div className="loading-content">
                    <h1 className="logo-loading">{salonName.toUpperCase()}</h1>
                    <div className="loader-bar"></div>
                    <p className="loading-text">Securing your slot...</p>
                </div>
            </div>

            {/* POLICY OVERLAY */}
            {showPolicy && (
                <div className="policy-overlay active" id="policy-overlay">
                    <div className="policy-modal">
                        <button type="button" className="close-x-btn" onClick={() => setShowPolicy(false)}>×</button>
                        <h1 className="policy-modal-header">Booking Policy</h1>

                        <div className="policy-grid">
                            <div className="policy-section">
                                <h3 className="policy-heading">LATE FEES:</h3>
                                <ul className="policy-list">
                                    <li>10 minutes late – ₱200</li>
                                    <li>20 minutes or more – ₱500</li>
                                    <li>Late fees help ensure timely appointments.</li>
                                </ul>
                            </div>
                            <div className="policy-section">
                                <h3 className="policy-heading">DEPOSIT : ₱450</h3>
                                <ul className="policy-list">
                                    <li>Deposits are non-refundable.</li>
                                    <li>Rescheduling results in a forfeited deposit.</li>
                                </ul>
                            </div>
                            <div className="policy-section">
                                <h3 className="policy-heading">WARRANTY</h3>
                                <ul className="policy-list">
                                    <li>We offer a 1-week service warranty.</li>
                                    <li>Inform us of any skin allergies or medical conditions.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="agreement-container">
                            <label className="custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={policyAgreed} 
                                    onChange={(e) => setPolicyAgreed(e.target.checked)} 
                                />
                                <span className="checkmark"></span>
                                <span className="agreement-text">I have read and agree to the Booking Policy.</span>
                            </label>
                        </div>

                        <div className="policy-button-group">
                            <button 
                                type="button" 
                                className="proceed-btn" 
                                disabled={!policyAgreed}
                                onClick={() => setShowPolicy(false)}
                            >
                                PROCEED TO BOOKING
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOOKING CONTAINER */}
            <div className="booking-wrapper">
                <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
                    {Object.keys(errors).length > 0 && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '15px', marginBottom: '20px', borderRadius: '6px', gridColumn: '1 / -1' }}>
                            <strong>Please fix the following errors:</strong>
                            <ul>
                                {Object.values(errors).map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <h1 id="title">SCHEDULE AN APPOINTMENT</h1>

                    <div className="stepper-container">
                        <div className="stepper-item active">
                            <span className="step-label">STEP 1 OF 3</span>
                            <div className="step-line"></div>
                        </div>
                        <div className="stepper-item"><div className="step-line"></div></div>
                        <div className="stepper-item"><div className="step-line"></div></div>
                    </div>

                    <main className="left-column">
                        <div className="section-title-row">
                            <div className="salon-identity">
                                <div className="b1-logo-wrap">
                                    {salonLogo ? (
                                        <img src={salonLogo} alt={salonName} />
                                    ) : (
                                        <span className="b1-logo-placeholder">{salonName.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="salon-name-text">{salonName}</h2>
                                    <p className="salon-addr-text">LOCATION: {salonLocation}</p>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown-container">
                            <label htmlFor="service-select" className="heading-serif">Choose a Base Coat *</label>
                            <select 
                                id="service-select" 
                                className="custom-dropdown text-inter" 
                                value={data.service} 
                                onChange={(e) => setData('service', e.target.value)}
                            >
                                <option value="0">-- Select a Base Coat --</option>
                                <option value="soft-gel">Soft Gel Extension - ₱850</option>
                                <option value="gel-overlay">Gel Overlay - ₱550</option>
                                <option value="hard-biab">Hard BIAB - ₱750</option>
                                <option value="soft-biab">Soft BIAB - ₱650</option>
                            </select>

                            <label htmlFor="size-select" className="heading-serif">Choose Base Coat Size *</label>
                            <select 
                                id="size-select" 
                                className="custom-dropdown text-inter" 
                                value={data.size} 
                                onChange={(e) => setData('size', e.target.value)}
                            >
                                <option value="0">-- Select a Base Coat Size --</option>
                                <option value="xl">Size: I - XXL - ₱200</option>
                                <option value="standard">Standard - ₱0</option>
                            </select>

                            {/* ADD-ONS SECTION */}
                            <h3 className="heading-serif" style={{ marginTop: '30px', fontSize: '25px', color: brandPrimary }}>Design Add-ons</h3>
                            <h3 className="text-inter" style={{ fontSize: '13px', opacity: 0.75, marginTop: 0 }}>
                                REMINDER: Prices may vary depending on the complexity of your chosen design, and more detailed requests may come with an additional cost. Please note that all add-on services must be paid in cash, and you can check the pricing grids below as your guide.
                            </h3>
                            <div className="addon-grid">
                                <div className={`addon-card ${data.addon === 'basic' ? 'selected' : ''}`} onClick={() => setData('addon', 'basic')}>
                                    <div className="addon-img-box"><img src="/img/basic.png" alt="Basic" /></div>
                                    <div className="addon-info">
                                        <h4 className="heading-serif">Basic</h4>
                                        <p className="text-inter">Minimal Design<br />1-2 accent Stones<br />Plain • French Tip</p>
                                        <span className="addon-price">+₱200</span>
                                    </div>
                                </div>

                                <div className={`addon-card ${data.addon === 'moderate' ? 'selected' : ''}`} onClick={() => setData('addon', 'moderate')}>
                                    <div className="addon-img-box"><img src="/img/moderate.png" alt="Moderate" /></div>
                                    <div className="addon-info">
                                        <h4 className="heading-serif">Moderate</h4>
                                        <p className="text-inter">Cat Eye • Stickers • Chromes<br />Embossed Design</p>
                                        <span className="addon-price">+₱500</span>
                                    </div>
                                </div>

                                <div className={`addon-card ${data.addon === 'heavy' ? 'selected' : ''}`} onClick={() => setData('addon', 'heavy')}>
                                    <div className="addon-img-box"><img src="/img/heavy.png" alt="Heavy" /></div>
                                    <div className="addon-info">
                                        <h4 className="heading-serif">Heavy</h4>
                                        <p className="text-inter">Freehand Nail Art<br />Unlimited Stones<br />Full 3D nail art</p>
                                        <span className="addon-price">+₱1000 - ₱2000</span>
                                    </div>
                                </div>
                            </div>

                            <label htmlFor="addon-select" className="heading-serif">Choose Design Add On *</label>
                            <select 
                                id="addon-select" 
                                className="custom-dropdown text-inter" 
                                value={data.addon} 
                                onChange={(e) => setData('addon', e.target.value)}
                            >
                                <option value="0">-- Select Add On --</option>
                                <option value="basic">Basic</option>
                                <option value="moderate">Moderate</option>
                                <option value="heavy">Heavy</option>
                            </select>

                            <div className="removal-container" style={{ marginTop: '15px' }}>
                                <label className="custom-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={data.removal} 
                                        onChange={(e) => setData('removal', e.target.checked)} 
                                    />
                                    <span className="checkmark"></span>
                                    <span className="text-inter" style={{ fontWeight: 600 }}>Add on Removal - ₱150 (Own Work)</span>
                                </label>
                            </div>
                        </div>

                        {/* FILE UPLOAD SECTION */}
                        <div className="upload-container">
                            <div className="provider-choice-container" style={{ marginBottom: '15px' }}>
                                <label className="custom-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={data.provider_chooses_design} 
                                        onChange={(e) => setData('provider_chooses_design', e.target.checked)} 
                                    />
                                    <span className="checkmark"></span>
                                    <span className="text-inter" style={{ fontWeight: 600, color: brandPrimary }}>
                                        Service provider will choose the design
                                    </span>
                                </label>
                            </div>

                            {!data.provider_chooses_design && (
                                <div className="upload-inner-card">
                                    <h3 className="heading-serif">Reference Images *</h3>
                                    <p className="text-inter">Upload an image that inspires you.</p>
                                    <input type="file" id="fileInput" hidden accept="image/*" onChange={handleImageChange} />
                                    
                                    <div className="upload-dropzone text-inter" onClick={() => document.getElementById('fileInput').click()}>
                                        {previewImg ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={previewImg} alt="Preview" style={{ maxHeight: '150px', borderRadius: '8px' }} />
                                                <button type="button" className="delete-btn" onClick={(e) => { e.stopPropagation(); removeImage(); }}>&times;</button>
                                            </div>
                                        ) : (
                                            <span>CLICK TO UPLOAD IMAGE</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* RIGHT COLUMN CALENDAR & SUMMARY */}
                    <aside className="right-column">
                        <div className="calendar-card">
                            <h3 className="heading-serif" style={{ fontSize: '25px', color: brandPrimary }}>Set Date and Time</h3>

                            {/* MONTH NAVIGATION */}
                            <div className="calendar-header">
                                <span className="text-inter" style={{ fontWeight: 600 }}>
                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <div className="cal-nav">
                                    <span className="nav-arrow" onClick={handlePrevMonth}>&lt;</span>
                                    <span className="nav-arrow" onClick={handleNextMonth}>&gt;</span>
                                </div>
                            </div>

                            {/* CALENDAR DAY GRID */}
                            <div className="calendar-grid text-inter">
                                {renderCalendarDays()}
                            </div>

                            {/* TIME SLOTS */}
                            <div className="slots-container" style={{ marginTop: '20px' }}>
                                <label className="text-inter" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px' }}>AVAILABLE SLOTS</label>
                                <div className="slots-grid">
                                    {slots.map((slot) => {
                                        const available = isSlotAvailable(slot);
                                        const isBooked = bookedForDate.includes(slot);
                                        const disabledStyle = isBooked
                                            ? { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none', textDecoration: 'line-through' }
                                            : { opacity: 0.3, cursor: 'not-allowed', pointerEvents: 'none', textDecoration: 'line-through' };
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                disabled={!available}
                                                title={isBooked ? 'Already booked' : ''}
                                                style={!available ? disabledStyle : undefined}
                                                className={`slot-btn ${data.selected_time === slot ? 'active' : ''} ${isBooked ? 'slot-occupied' : ''}`}
                                                onClick={() => setData('selected_time', slot)}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="summary-section">
                            <div className="summary-line">
                                <div className="text-inter">
                                    <span style={{ fontWeight: 600, fontSize: '10px', color: '#78716C', textTransform: 'uppercase' }}>Summary</span><br />
                                    <span>{data.selected_date ? `${data.selected_date} at ${data.selected_time}` : 'Please select a date'}</span>
                                </div>
                                <div className="summary-price">₱<span>{totalPrice}</span></div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (data.service === '0') {
                                        alert('Please select a service.');
                                        return;
                                    }
                                    if (!data.selected_date) {
                                        alert('Please select a future date on the calendar.');
                                        return;
                                    }
                                    if (data.size === '0') {
                                        alert('Please select a size option.');
                                        return;
                                    }
                                    if (data.addon === '0') {
                                        alert('Please select a design add-on.');
                                        return;
                                    }
                                    if (!data.provider_chooses_design && !data.reference_image) {
                                        alert("Please upload a reference image or check 'Service provider will choose the design'.");
                                        return;
                                    }

                                    const sizePrice = PRICE_TABLE.size[data.size] || 0;
                                    const addonPrice = PRICE_TABLE.addon[data.addon] || 0;
                                    const removalPrice = data.removal ? PRICE_TABLE.removal : 0;
                                    const servicePrice = PRICE_TABLE.service[data.service] || service?.price || 850;
                                    const serviceName = SERVICE_LABELS[data.service] || service?.name || 'Selected Treatment';

                                    onNext({
                                        serviceName,
                                        servicePrice,
                                        sizePrice,
                                        addonPrice,
                                        removalPrice,
                                        selected_date: data.selected_date,
                                        selected_time: data.selected_time,
                                        totalPrice: totalPrice
                                    });
                                }}
                                className="confirm-btn"
                            >
                                CONFIRM APPOINTMENT
                            </button>

                            <p className="next-step">NEXT: PERSONAL INFORMATION</p>
                        </div>
                    </aside>
                </form>
            </div>

            {/* FOOTER */}
            <SiteFooter />
        </>
    );
}