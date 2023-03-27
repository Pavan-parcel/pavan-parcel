import React from 'react'
import './admin.sass'
import {Link} from 'react-router-dom'

const Admin = () => {
    return (
        <section className='pt__admin'>
            <form>
                <div className='container'>
                    <div className='row justify-between'>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Sender Name</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Sender Number</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Name</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Number</label>
                                <input />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Item Details</label>
                                <select name="cars" id="cars">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Colors</label>
                                <select name="cars" id="cars">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                    <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Quantity Number</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Rate</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Total Amount</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Payment Type</label>
                                <select name="cars" id="cars">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Place to send</label>
                                <select name="cars" id="cars">
                                    <option value="volvo">Volvo</option>
                                    <option value="saab">Saab</option>
                                    <option value="mercedes">Mercedes</option>
                                    <option value="audi">Audi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-between mt-30">
                    <div className='col-4'>
                            <div className='form_control_wrapper'>
                                <label>Remarks</label>
                                <input />
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='form_control_wrapper'>
                                <label>Drive</label>
                                <input />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className="col-12">

                    <div className='pt__lr_num time_btn'>Print and Save</div>
                        </div>
                    </div>

                    
                </div>
            </form>
        </section>
    )
}

export default Admin