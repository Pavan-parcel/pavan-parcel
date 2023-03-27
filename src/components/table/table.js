import React from 'react'
import './table.sass'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    General
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="">
                    <div className="days_count d-flex justify-between">
                        <h6>Date : </h6>
                        <select name="" id="" className='col-10'>
                            <option value=""> 03/27/2023 - 03/27/203 </option>
                            <option value=""> Tomorrow </option>
                            <option value=""> Last Week </option>
                            <option value=""> Last Month </option>
                            <option value=""> This Month </option>
                            <option value=""> Custom </option>
                        </select>
                    </div>
                    <div className="line"></div>
                    <select name="" id="" className='w-100 general_delivery'>
                        <option value="">Delivery General (In)</option>
                        <option value="">General (Out)</option>
                    </select>
                    
                </form>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
}


const Table = () => {

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <section className='pt__table_print'>
            <div className="container">
                <div className="row justify-between">
                    <div className="table-other gap-30 col-8">
                        <Button variant="primary" className='pt__lr_item time_btn' onClick={() => setModalShow(true)}>
                        General
                        </Button>

                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                        
                        <a className='pt__lr_item time_btn' href='#'>
                            Bulk Slip Print
                        </a>
                        <a className='pt__lr_item time_btn' href='#'>
                            Parcel Status
                        </a>
                    </div>
                    <div className="search_lr col-4">
                        <form className='header_form'>
                            <input type="date" placeholder='Enter LR Number' className='header_input' />
                            <input type="submit" className='btn' value="Find Details" />
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="pt__table-data">
                        <table cellPadding='0' cellSpacing='0'>
                            <tr>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Receipt No.
                                </th>
                                <th>
                                    Sender Name
                                </th>
                                <th>
                                    Receiver Name
                                </th>
                                <th>
                                    Item Detail
                                </th>
                                <th>
                                    Quantity No.
                                </th>
                                <th>
                                    Total Amount
                                </th>
                                <th>
                                    Payment Type
                                </th>
                                <th>
                                    Place to send
                                </th>
                                <th>
                                    Print & Action
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Date
                                </td>
                                <td>
                                    Reciept No.
                                </td>
                                <td>
                                    Sender Name
                                </td>
                                <td>
                                    Reciever Name
                                </td>
                                <td>
                                    Item Detail
                                </td>
                                <td>
                                    Quantity No.
                                </td>
                                <td>
                                    Total Amount
                                </td>
                                <td>
                                    Payment Type
                                </td>
                                <td>
                                    Place to send
                                </td>
                                <td>
                                    Print & Action
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    Date
                                </td>
                                <td>
                                    Reciept No.
                                </td>
                                <td>
                                    Sender Name
                                </td>
                                <td>
                                    Reciever Name
                                </td>
                                <td>
                                    Item Detail
                                </td>
                                <td>
                                    Quantity No.
                                </td>
                                <td>
                                    Total Amount
                                </td>
                                <td>
                                    Payment Type
                                </td>
                                <td>
                                    Place to send
                                </td>
                                <td>
                                    <Link>  </Link>
                                </td>

                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Table