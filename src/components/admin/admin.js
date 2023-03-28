import React, { useState } from 'react'
import './admin.sass'
import supabase from '../../supabase/supabaseClient.js'
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Admin = () => {
    const [color, setColor] = useState('');
    const [rate, setRate] = useState('');
    const [parcel, setParcel] = useState({
        receipt_no: '',
        sender_name: '',
        receiver_name: '',
        sender_number: '',
        receiver_number: '',
        item_detail: '',
        quantity: '',
        total_amount: '',
        payment_type: '',
        place_to_send: '',
        remarks: '',
        driver: ''
    })

    const formSchema = Yup.object({
        sender_name: Yup.string().required("Enter Sender Name")
    })

    const onPrintAndSave = async () => {
        const { data, error } = await supabase.from("parcels").insert({ ...parcel })
        if (!error) {
            console.log("data: ", data);
            window.location.reload(false);
        } else {
            console.log("error: ", error);
            throw new Error(error);
        }
    }

    const validate = Yup.object().shape({
        sender_name: Yup.string().required("Sender name is required")
    })

    const formik = useFormik({
        initialValues: {
            sender_name: '',
            sender_number: '',
            receiver_name: '',
            receiver_number: '',
            item_detail: '',
            quantity: '',
            rate: '',
            payment_type: '',
            total_amount: '',
            place_to_send: '',
            remarks: '',
            drive: ''
        },
        validationSchema: validate,
        onSubmit: async (values) => {
            console.log("values: ", values)
        }
    })

    return (
        <section className='pt__admin'>
            <form onSubmit={formik.handleSubmit}>
                <div className='container'>
                    <div className='row justify-between'>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Sender Name</label>
                                <input
                                    name='sender_name'
                                    value={formik.values.sender_name}
                                    onChange={(e) => { setParcel(prev => ({ ...prev, sender_name: e.target.value })); formik.handleChange(e) }}
                                />
                                {
                                    formik.errors.sender_name && <div className='text-danger'>{formik.errors.sender_name}</div>
                                }
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Sender Number</label>
                                <input
                                    value={parcel.sender_number}
                                    onChange={(e) => setParcel(prev => ({ ...prev, sender_number: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Name</label>
                                <input
                                    value={parcel.receiver_name}
                                    onChange={(e) => setParcel(prev => ({ ...prev, receiver_name: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Receiver Number</label>
                                <input
                                    value={parcel.receiver_number}
                                    onChange={(e) => setParcel(prev => ({ ...prev, receiver_number: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Item Details</label>
                                <select name="cars" id="cars" value={parcel.item_detail} onChange={(e) => { setParcel(prev => ({ ...prev, item_detail: color + " " + e.target.value })) }}>
                                    <option value="Volvo">Volvo</option>
                                    <option value="Saab">Saab</option>
                                    <option value="Mercedes">Mercedes</option>
                                    <option value="Audi">Audi</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-30'>
                            <div className='form_control_wrapper'>
                                <label>Colors</label>
                                <select name="colors" id="colors" onChange={(e) => { setParcel(prev => ({ ...prev, item_detail: e.target.value + " " + parcel.item_detail })); setColor(e.target.value) }}>
                                    <option value="Red">Red</option>
                                    <option value="Green">Green</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Cyan">Cyan</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Quantity Number</label>
                                <input
                                    value={parcel.quantity}
                                    onChange={(e) => setParcel(prev => ({ ...prev, quantity: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Rate</label>
                                <input
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Total Amount</label>
                                <input
                                    value={parcel.total_amount}
                                    onChange={(e) => setParcel(prev => ({ ...prev, total_amount: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Payment Type</label>
                                <select name="Payment Type" id="payment_type" onChange={(e) => setParcel(prev => ({ ...prev, payment_type: e.target.value }))}>
                                    <option value="Baki">Baki</option>
                                    <option value="Jama">Jama</option>
                                    <option value="Account">Account</option>
                                    <option value="Free of Charge">Free of Charge</option>
                                </select>
                            </div>
                        </div>
                        <div className='col-2'>
                            <div className='form_control_wrapper'>
                                <label>Place to send</label>
                                <select name="cars" id="cars" onChange={(e) => setParcel(prev => ({ ...prev, place_to_send: e.target.value }))}>
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
                                <input
                                    value={parcel.remarks}
                                    onChange={(e) => setParcel(prev => ({ ...prev, remarks: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='form_control_wrapper'>
                                <label>Drive</label>
                                <input
                                    value={parcel.driver}
                                    onChange={(e) => setParcel(prev => ({ ...prev, driver: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-between mt-30">
                        <div className="col-12">

                            <button type='submit' className='pt__lr_num time_btn btn btn-submit'>Print and Save</button>
                        </div>
                    </div>


                </div>
            </form>
        </section>
    )
}

export default Admin