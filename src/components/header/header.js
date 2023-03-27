import React from 'react';
import logo from '../../images/logo.png'
import './header.sass'
import { Link } from 'react-router-dom';

const Header = () => {

    return (
        <header>
            <div className="container">
                <div className="row align-center">
                    <div className="col-12">
                        <div className="zn__header-wrapper">
                            <div className='d-flex align-center gap'>
                            <div className="zn__header-logo">
                                <Link to="/">
                                    <img src={logo} alt="logo" /> 
                                </Link>
                            </div>
                            <nav className="zn__header-menu">
                                <ul>
                                    <li className="zn__main-menu-list">
                                        <Link>
                                        Dashboard
                                        </Link>
                                    </li>
                                    <li className="zn__main-menu-list">
                                        <Link>
                                        Parcel Management
                                        </Link>
                                    </li>
                                    <li className="zn__main-menu-list">
                                        <Link>
                                        Expenses
                                        </Link>
                                    </li>
                                    <li className="zn__main-menu-list">
                                        <Link>
                                        Maintenance Management
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                            </div>
                            <div className="zn__header-btn">
                                <form className='header_form'>

                                    <input type="number" placeholder='Enter LR Number' className='header_input' />
                                    <input type="submit" className='btn' value="Find Details"/>
                                </form> 
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="zn__header-line"></div>
        </header>
    )
}

export default Header