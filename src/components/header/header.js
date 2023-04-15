import React from "react";
import logo from "../../images/logo.png";
import "./header.sass";
import { Link, useNavigate } from "react-router-dom";
import { CONSTANTS, UTILS } from "../../utils/contants";
import {FiLogOut} from 'react-icons/fi'

const Header = () => {
    const navigate = useNavigate();
  return (
    <header>
      <div className="container">
        <div className="row align-center">
          <div className="col-12">
            <div className="zn__header-wrapper">
              <div className="d-flex align-center gap">
                <div className="zn__header-logo">
                  <Link to="/">
                    <img src={logo} alt="logo" />
                  </Link>
                </div>
                <nav className="zn__header-menu">
                  <ul>
                    <li className="zn__main-menu-list">
                      <Link to="/setting/items">Setting</Link>
                    </li>
                    <li className="zn__main-menu-list">
                      <Link
                        to=""
                        onClick={() => (UTILS.payment_type = "To Pay")}
                        className="btn btn-primary"
                      >
                        To Pay
                      </Link>
                    </li>
                    <li className="zn__main-menu-list">
                      <Link
                        to=""
                        onClick={() => (UTILS.payment_type = "Paid")}
                        className="btn btn-primary"
                      >
                        Paid
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="zn__header-btn">
                <form className="header_form">
                  <input
                    type="number"
                    placeholder="Enter LR Number"
                    className="header_input"
                  />
                  <input type="submit" className="btn" value="Find Details" />
                </form>

                <button
                  className="btn btn-primary ms-5"
                  onClick={() => {localStorage.removeItem(CONSTANTS.BRANCH); navigate('/login')}}
                >
                  Logout
                  <FiLogOut className="ms-2" size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
