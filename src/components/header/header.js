import React, { useState } from "react";
import logo from "../../images/pavan_logo.jpeg";
import "./header.sass";
import { Link, useNavigate } from "react-router-dom";
import { CONSTANTS, UTILS } from "../../utils/contants";
import {FiLogOut} from 'react-icons/fi'
import supabase from "../../supabase/supabaseClient";

const Header = () => {
    const navigate = useNavigate();
    const [lr, setLr] = useState(null);

    const onFindDetails = async() => {
      const {data, error} = await supabase.from("parcels").select("*").eq("receipt_no", lr);
      if(!error){
        console.log("data: ", data);
        navigate("/lr", {state: {data: data}})
      } else {
        console.log("error: ", error);
      }
    }

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
                      <Link to="/setting/items" className="btn btn-primary">Setting</Link>
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
                    value={lr}
                    onChange={(e) => {
                      setLr(e.target.value)
                    }}
                  />
                  <Link to='' className="btn btn-primary" onClick={onFindDetails}>
                    Find Details
                  </Link>
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
