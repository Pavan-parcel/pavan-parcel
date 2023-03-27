import React from 'react'
import './login.sass'
import login from '../../images/truck.svg'

const Login = () => {
    return (
        <section className='pt__login'>
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <div className="pt__login_img">
                            <img src={login} alt="" />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="pt__login_form">
                            <form action="">
                                <h2>Pavan Parcel Service</h2>
                                <p>The right transportation solution for you</p>

                                <div className="pt__login_input">
                                    <label>Username</label>
                                    <input type="text" name="" id="" className='form-control' />
                                </div>
                                <div className="pt__login_input">
                                    <label>Password</label>
                                    <input type="text" name="" id="" className='form-control' />
                                </div>
                                <div className="pt__login_btn">
                                    <input type="submit" name="" id="" value='Submit' className='submit_btn' />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login