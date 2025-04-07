import React from 'react'
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function Header() {
    const location = useLocation();

    const getHeaderName = () => {
        switch (location.pathname) {
            case '/':
                return 'Language';
            case '/category':
                return 'Category';
            case '/post':
                return 'Post';
            case '/contact':
                return 'Contact';
            case '/banner':
                return 'Banner';
            case '/reels':
                return 'Reels';
            case '/font':
                return 'Fonts';
            case '/framecolor':
                return 'Frame Color';
            case '/background':
                return 'Background';
            case '/upcomingevent':
                return 'Upcoming Event';
            case '/homecategory':
                return 'Home Category';
            case '/homepost':
                return 'Home Post';
            case '/bussinesscategory':
                return 'Bussiness Category';
            case '/bussinesssubcategory':
                return 'Bussiness Sub Category';
                case '/bussinesspost':
                    return 'Bussiness Post';
            default:
                return 'Dashboard';
        }
    };
    return (
        <div>
            <div>
                <div className='header-dash py-2 px-3 d-flex'>
                    {/* <Button variant="primary" className="mb-0 me-2">
                        <i className="fa-solid fa-bars"></i>
                    </Button> */}
                    <h2 className='ms-lg-0 ms-md-5 ms-sm-5 ms-5'>{getHeaderName()}</h2>
                </div>
            </div>
        </div>
    )
}
