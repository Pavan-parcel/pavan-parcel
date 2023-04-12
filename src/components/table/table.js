import React, { useEffect, useState } from "react";
import "./table.sass";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import supabase from "../../supabase/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MyVerticallyCenteredModal(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">General</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="" className="form_control_wrapper">
          <div className="days_count d-flex gap-3 align-center">
            <h6>Date : </h6>
            <div className="text-dark d-flex align-items-center gap-3">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={new Date()}
                />
              <div className="">to</div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                maxDate={new Date()}
              />
            </div>
            {/* <select name="" id="" className='col-10'>
                            <option value=""> 03/27/2023 - 03/27/203 </option>
                            <option value=""> Tomorrow </option>
                            <option value=""> Last Week </option>
                            <option value=""> Last Month </option>
                            <option value=""> This Month </option>
                            <option value=""> Custom </option>
                        </select> */}
          </div>
          <div className="line"></div>
          <select name="" id="" className="w-100 general_delivery my-4">
            <option value="">Delivery General (In)</option>
            <option value="">General (Out)</option>
          </select>
          <div className="send-to-rec d-flex justify-content-between align-items-center">
            <select name="" id="" className="w-100 general_delivery">
              <option value="">Hirabag</option>
              <option value="">Bharuch</option>
            </select>
            <p className="px-3">To</p>
            <select name="" id="" className="w-100 general_delivery">
              <option value="">Amdavad</option>
              <option value="">Bapunagar</option>
            </select>
          </div>

          <Modal.Footer>
            <Button>Create General</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}

const Table = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const { data, error } = await supabase.from("parcels").select("*");
    if (!error) {
      const filteredData = data.filter(
        (item) =>
          new Date(item?.created_at).toLocaleDateString() ===
          new Date().toLocaleDateString()
      );
      setData(filteredData);
    } else {
      throw new Error(error);
    }
  }

  return (
    <section className="pt__table_print">
      <div className="container">
        <div className="row justify-between">
          <div className="table-other gap-30 col-8">
            <Button
              variant="primary"
              className="pt__lr_item time_btn"
              onClick={() => setModalShow(true)}
            >
              General
            </Button>

            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

            <a className="pt__lr_item time_btn" href="#">
              Bulk Slip Print
            </a>
            <a className="pt__lr_item time_btn" href="#">
              Parcel Status
            </a>
          </div>
          <div className="search_lr col-4">
            <form className="header_form">
              <input
                type="date"
                placeholder="Enter LR Number"
                className="header_input"
              />
              <input type="submit" className="btn" value="Find Details" />
            </form>
          </div>
        </div>
        <div className="row">
          <div className="pt__table-data">
            <table cellPadding="0" cellSpacing="0">
              <tr>
                <th>Date</th>
                <th>Receipt No.</th>
                <th>Sender Name</th>
                <th>Receiver Name</th>
                <th>Item Detail</th>
                <th>Quantity No.</th>
                <th>Total Amount</th>
                <th>Payment Type</th>
                <th>Place to send</th>
                <th>Print & Action</th>
              </tr>
              {data.map((item, index) => (
                <tr>
                  <td>{new Date(item?.created_at).toLocaleDateString()}</td>
                  <td>{item?.id}</td>
                  <td>{item?.sender_name}</td>
                  <td>{item?.receiver_name}</td>
                  <td>{item?.item_detail}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.total_amount}</td>
                  <td>{item?.payment_type}</td>
                  <td>{item?.place_to_send}</td>
                  <td>Print & Action</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
