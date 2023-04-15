import React, { useEffect, useRef, useState } from "react";
import "./table.sass";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import supabase from "../../supabase/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CONSTANTS } from "../../utils/contants";
import { Document } from "../../general/document";
import { useReactToPrint } from "react-to-print";
import moment from "moment";

function MyVerticallyCenteredModal(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [branches, setBranches] = useState([]);
  const [data, setData] = useState([]);
  const [sentBranch, setSentBranch] = useState("");

  const generalRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => generalRef.current,
  });

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      handlePrint();
    }
  }, [data]);

  const getBranches = async () => {
    const { data, error } = await supabase.from("branches").select("*");
    if (!error) {
      //   console.log("data: ", data);
      setBranches(data);
    } else {
      console.log("error: ", error);
    }
  };

  const getGeneralData = async () => {
    if (startDate.getDate() !== endDate.getDate()) {
      const { data, error } = await supabase
        .from("parcels")
        .select("*")
        .lte("created_at", moment(endDate).add(1, "day").format("YYYY-MM-DD"))
        .gte("created_at", moment(startDate).format("YYYY-MM-DD"));
      if (data) {
        let datas = data.filter(
          (parcel) => parcel.place_to_send === sentBranch
        );
        if(sentBranch && sentBranch === "all"){
          setData(data);
        } else if(sentBranch && sentBranch !== "all"){
          setData(datas)
        }
        console.log("data1: ", data);
      } else {
        throw new Error(error);
      }
    } else {
      const { data, error } = await supabase
        .from("parcels")
        .select("*")
        .gte("created_at", moment(startDate).format("YYYY-MM-DD"));
      if (data) {
        let datas = data.filter(
          (parcel) => parcel.place_to_send === sentBranch
        );
        if(sentBranch && sentBranch === "all"){
          setData(data);
        } else if(sentBranch && sentBranch !== "all"){
          setData(datas)
        }
      } else {
        throw new Error(error);
      }
    }
  };

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
        <div className="d-none">
          <Document ref={generalRef} data={data} />
        </div>
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
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="line mt-5"></div>
          {/* <select name="" id="" className="w-100 general_delivery my-4">
            <option value="">Delivery General (In)</option>
            <option value="">General (Out)</option>
          </select> */}
          <div className="send-to-rec d-flex justify-content-between align-items-center">
            <select name="" id="" disabled className="w-100 general_delivery">
              <option value={localStorage.getItem(CONSTANTS.BRANCH)}>
                {localStorage.getItem(CONSTANTS.BRANCH)}
              </option>
              {/* {
                  branches && branches.map((branch) => (
                    <option value={branch?.branch_name}>{branch?.branch_name}</option>
                ))
              } */}
            </select>
            <p className="px-3">To</p>
            <select
              className="w-100 general_delivery"
              value={sentBranch}
              onChange={(e) => {
                setSentBranch(e.target.value)
              }}
            >
              <option value="">To branch</option>
              <option value="all">All</option>
              {branches &&
                branches
                  .filter(
                    (branch) =>
                      branch.branch_name !==
                      localStorage.getItem(CONSTANTS.BRANCH)
                  )
                  .map((branch) => (
                    <option value={branch?.branch_name}>
                      {branch?.branch_name}
                    </option>
                  ))}
            </select>
          </div>

          <Modal.Footer>
            <Button onClick={getGeneralData}>Create General</Button>
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
            new Date().toLocaleDateString() &&
          item.branch === localStorage.getItem(CONSTANTS.BRANCH)
      );
      setData(filteredData);
    } else {
      throw new Error(error);
    }
  }

  return (
    <section className="pt__table_print mb-5">
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
