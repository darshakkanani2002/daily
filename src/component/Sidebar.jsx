import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import './Sidebar.css';

export default function Sidebar() {
    const [show, setShow] = useState(false);
    const [activeMenu, setActiveMenu] = useState(() => {
        return sessionStorage.getItem('activeMenu') || 'language';
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        sessionStorage.setItem('activeMenu', menu); // Save the active menu to localStorage
        handleClose(); // Close the offcanvas when an item is selected
    };

    return (
        <div>
            <>
                <Button variant="primary" onClick={handleShow} className="mb-3 d-md-none sidebar-toggel-button">
                    <i className="fa-solid fa-bars"></i>
                </Button>

                <div className="sidebar d-none sidebar-menu-display">
                    <h2><img src="/images/fav-icon.png" alt="fav-icon" className='img-fluid' /><span className='h5 fw-bold'>Daily Quates</span></h2>
                    <ul className="side-menu">
                        <li className={`my-2 ${activeMenu === 'language' ? 'active' : ''}`}>
                            <Link to="/" className='nav-link active' onClick={() => handleMenuClick('language')}>
                                <i className="fa-solid fa-language me-3 sidebar-icon"></i>Language
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'category' ? 'active' : ''}`}>
                            <Link to="/category" className='nav-link' onClick={() => handleMenuClick('category')}>
                                {/* <i className="fa-solid fa-signs-post me-3 sidebar-icon"></i> */}
                                <i className="fa-solid fa-layer-group me-3 sidebar-icon"></i>Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'post' ? 'active' : ''}`}>
                            <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                <i className="fa-solid fa-signs-post me-3 sidebar-icon"></i>
                                Post
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'banner' ? 'active' : ''}`}>
                            <Link to="/banner" className='nav-link' onClick={() => handleMenuClick('banner')}>
                                <i class="fa-solid fa-scroll-torah me-3 sidebar-icon"></i>
                                Banner
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'reels' ? 'active' : ''}`}>
                            <Link to="/reels" className='nav-link' onClick={() => handleMenuClick('reels')}>
                                <i class="fa-solid fa-school-circle-check me-3 sidebar-icon"></i>
                                Reels
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'font' ? 'active' : ''}`}>
                            <Link to="/font" className='nav-link' onClick={() => handleMenuClick('font')}>
                                <i class="fa-solid fa-font me-3 sidebar-icon"></i>
                                Fonts
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'framecolor' ? 'active' : ''}`}>
                            <Link to="/framecolor" className='nav-link' onClick={() => handleMenuClick('framecolor')}>
                                <i class="fa-solid fa-palette me-3 sidebar-icon"></i>
                                Frame Color
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'background' ? 'active' : ''}`}>
                            <Link to="/background" className='nav-link' onClick={() => handleMenuClick('background')}>
                                <i class="fa-solid fa-square me-3 sidebar-icon"></i>
                                Background
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'upcomingevent' ? 'active' : ''}`}>
                            <Link to="/upcomingevent" className='nav-link' onClick={() => handleMenuClick('upcomingevent')}>
                                <i class="fa-solid fa-calendar-days me-3 sidebar-icon"></i>
                                Upcoming Event
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'homecategory' ? 'active' : ''}`}>
                            <Link to="/homecategory" className='nav-link' onClick={() => handleMenuClick('homecategory')}>
                                <i class="fa-solid fa-house me-3 sidebar-icon"></i>
                                Home Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'homepost' ? 'active' : ''}`}>
                            <Link to="/homepost" className='nav-link' onClick={() => handleMenuClick('homepost')}>
                                <i class="fa-solid fa-house me-3 sidebar-icon"></i>
                                Home Post
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'bussinesscategory' ? 'active' : ''}`}>
                            <Link to="/bussinesscategory" className='nav-link' onClick={() => handleMenuClick('bussinesscategory')}>
                                <i class="fa-solid fa-house me-3 sidebar-icon"></i>
                                Bussiness Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'bussinesssubcategory' ? 'active' : ''}`}>
                            <Link to="/bussinesssubcategory" className='nav-link' onClick={() => handleMenuClick('bussinesssubcategory')}>
                                <i class="fa-solid fa-house me-3 sidebar-icon"></i>
                                Bussiness Sub Category
                            </Link>
                        </li>
                        <li className={`my-2 ${activeMenu === 'bussinesspost' ? 'active' : ''}`}>
                            <Link to="/bussinesspost" className='nav-link' onClick={() => handleMenuClick('bussinesspost')}>
                                <i class="fa-solid fa-house me-3 sidebar-icon"></i>
                                Bussiness Post
                            </Link>
                        </li>
                    </ul>
                </div>

                <Offcanvas show={show} onHide={handleClose} className="d-md-none">
                    <Offcanvas.Header closeButton>
                        <h2>Daily Quates</h2>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ul className="side-menu">
                            <li className={`my-3 ${activeMenu === 'language' ? 'active' : ''}`}>
                                <Link to="/" className='nav-link' onClick={() => handleMenuClick('language')}>
                                    Language
                                </Link>
                            </li>
                            <li className={`my-3 ${activeMenu === 'category' ? 'active' : ''}`}>
                                <Link to="/category" className='nav-link' onClick={() => handleMenuClick('category')}>
                                    Category
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'post' ? 'active' : ''}`}>
                                <Link to="/post" className='nav-link' onClick={() => handleMenuClick('post')}>
                                    Post
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'banner' ? 'active' : ''}`}>
                                <Link to="/banner" className='nav-link' onClick={() => handleMenuClick('banner')}>
                                    Banner
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'reels' ? 'active' : ''}`}>
                                <Link to="/reels" className='nav-link' onClick={() => handleMenuClick('reels')}>
                                    Reels
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'font' ? 'active' : ''}`}>
                                <Link to="/font" className='nav-link' onClick={() => handleMenuClick('font')}>
                                    Fonts
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'framecolor' ? 'active' : ''}`}>
                                <Link to="/framecolor" className='nav-link' onClick={() => handleMenuClick('framecolor')}>
                                    Frame Color
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'background' ? 'active' : ''}`}>
                                <Link to="/background" className='nav-link' onClick={() => handleMenuClick('background')}>
                                    Background
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'upcomingevent' ? 'active' : ''}`}>
                                <Link to="/upcomingevent" className='nav-link' onClick={() => handleMenuClick('upcomingevent')}>
                                    Upcoming Event
                                </Link>
                            </li>
                            <li className={`my-2 ${activeMenu === 'homecategory' ? 'active' : ''}`}>
                                <Link to="/homecategory" className='nav-link' onClick={() => handleMenuClick('homecategory')}>
                                    Home Category
                                </Link>
                            </li>
                        </ul>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        </div>
    )
}
