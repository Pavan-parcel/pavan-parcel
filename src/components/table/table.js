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
import { Link, useNavigate } from "react-router-dom";

function MyVerticallyCenteredModal(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [branches, setBranches] = useState([]);
  const [data, setData] = useState([]);
  const [sentBranch, setSentBranch] = useState("");

  const generalRef = useRef();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => generalRef.current,
  });

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // handlePrint();
      navigate('/general', { state: { data: data, dates: {startDate: startDate, endDate: endDate} } });
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
        .eq("created_at", moment(startDate).format("YYYY-MM-DD"));
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
  const [date, setDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const onFindDetails = async(lr) => {
    const {data, error} = await supabase.from("parcels").select("*").eq("receipt_no", lr);
    if(!error){
      console.log("data: ", data);
      navigate("/lr", {state: {data: data}})
    } else {
      console.log("error: ", error);
    }
  }

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

  const onDateFind = async (e) => {
    e.preventDefault();
    const {data, error} = await supabase.from('parcels').select("*").gte("created_at", moment(date).format("YYYY-MM-DD"));
    if(!error){
      const parcels = data.filter(parcel => parcel.branch === localStorage.getItem(CONSTANTS.BRANCH));
      navigate('/general', { state: { data: parcels, dates: {startDate: date, endDate: date} } });
    }
    else {
      throw new Error(error)
    }
  }

  const getTotal = () => {
    var quantity = 0;
    var total_amount = 0;
  
    for (let i = 0; i < data?.length; i++) {
      quantity += Number(data[i].quantity);
      total_amount += Number(data[i].total_amount);
    }
    return {quantity: quantity, total_amount: total_amount};
  }

  const {quantity, total_amount} = getTotal();

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

          </div>
          <div className="search_lr col-4">
            <form className="header_form">
              {/* <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                maxDate={new Date()}
              /> */}
              <input
                type="date"
                placeholder="Select date"
                className="header_input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
              <input type="submit" className="btn" value="Find Details" onClick={onDateFind} />
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
                  <td> <Link className="btn-success btn" onClick={() => onFindDetails(item?.receipt_no)}> {item?.receipt_no} </Link></td>
                  <td>{item?.sender_name}</td>
                  <td>{item?.receiver_name}</td>
                  <td>{item?.item_detail}</td>
                  <td>{item?.quantity}</td>
                  <td>{item?.total_amount}</td>
                  <td className={item?.payment_type === "Paid" ? 'text-success' : 'text-danger'}>{item?.payment_type}</td>
                  <td>{item?.place_to_send}</td>
                  <td>Print & Action</td>
                </tr>
              ))}
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td className="fw-bolder">{quantity}</td>
                <td className="fw-bolder">{total_amount}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Table;
