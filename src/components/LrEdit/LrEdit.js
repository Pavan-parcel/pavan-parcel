import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LrEdit.sass";
import * as Yup from "yup";
import { useFormik } from "formik";
import supabase from "../../supabase/supabaseClient";
import { CONSTANTS } from "../../utils/contants";
import { useReactToPrint } from "react-to-print";
import Builty from "../../builty/builty";

const LrEdit = () => {
  const { state } = useLocation();
  const { data } = state;

  const [updateData, setUpdateData] = useState([]);

  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);

  const builtyRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => builtyRef.current,
  });

  useEffect(() => {
    getBranches();
    getItems();
    getColors();
    formik.setFieldValue("sender_name", data[0]?.sender_name);
    formik.setFieldValue("sender_number", data[0]?.sender_number);
    formik.setFieldValue("receiver_name", data[0]?.receiver_name);
    formik.setFieldValue("receiver_number", data[0]?.receiver_number);
    formik.setFieldValue("item_detail", data[0]?.item_detail);
    formik.setFieldValue("color", data[0]?.color);
    formik.setFieldValue("quantity", data[0]?.quantity);
    formik.setFieldValue(
      "rate",
      data[0]?.rate
    );
    formik.setFieldValue("total_amount", Number(data[0]?.total_amount)-10);
    formik.setFieldValue("payment_type", data[0]?.payment_type);
    formik.setFieldValue("place_to_send", data[0]?.place_to_send);
    formik.setFieldValue("remarks", data[0]?.remarks);
  }, []);

  useEffect(() => {
    if(updateData.length > 0){
      handlePrint();

      // Delay the page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [updateData]);

  const getBranches = async () => {
    const { data, error } = await supabase.from("place_to_send").select("*");
    if (!error) {
      //   console.log("data: ", data);
      // let datas = data.filter(
      //   (item) => item.branch_name !== localStorage.getItem(CONSTANTS.BRANCH)
      // );
      setBranches(data);
    } else {
      console.log("error: ", error);
    }
  };

  const getItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (!error) {
      //   console.log("data: ", data);
      setItems(data);
    } else {
      console.log("error: ", error);
    }
  };

  const getColors = async () => {
    const { data, error } = await supabase.from("colors").select("*");
    if (!error) {
      //   console.log("data: ", data);
      setColors(data);
    } else {
      console.log("error: ", error);
    }
  };

  const validate = Yup.object().shape({
    sender_name: Yup.string().required("Please enter Sender name"),
    sender_number: Yup.string()
      .required("Please enter Sender number")
      .max(10, "Maximum 10 numbers only!")
      .min(10, "Minimum 10 numbers!"),
    receiver_name: Yup.string().required("Please enter Receiver name"),
    receiver_number: Yup.string()
      .required("Please enter Receiver number")
      .max(10, "Maximum 10 numbers only!")
      .min(10, "Minimum 10 numbers!"),
    item_detail: Yup.string().required("Please select item detail"),
    // color: Yup.string().required("Please select item color"),
    quantity: Yup.string().required("Please enter qunatity"),
    rate: Yup.string().required("Please enter rate"),
    total_amount: Yup.string().required("Please enter total amount"),
    payment_type: Yup.string().required("Please select Payment type"),
    place_to_send: Yup.string().required("Please select Place to Send"),
    // remarks: Yup.string().required("Please enter remarks"),
    // driver: Yup.string().required("Please enter driver number"),
  });

  const formik = useFormik({
    initialValues: {
      sender_name: "",
      sender_number: "",
      receiver_name: "",
      receiver_number: "",
      item_detail: "",
      color: "",
      quantity: "",
      rate: "",
      payment_type: "",
      total_amount: "",
      place_to_send: "",
      remarks: "",
      //   driver: "",
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      //   console.log("values: ", values);
      const { data, error } = await supabase
        .from("parcels")
        .update({
          ...values,
          total_amount: Number(formik.values.total_amount) + 10
        })
        .eq("receipt_no", state?.data[0]?.receipt_no).select("*");
      if (!error) {
        setUpdateData(data)
        // window.location.reload();
      } else {
        console.log("update error: ", error);
      }
    },
  });

  const onCancel = async () => {
    const { data, error } = await supabase
      .from("parcels")
      .update({ returned: true })
      .eq("id", state?.data[0]?.id);
    if (!error) {
      console.log("success return");
      navigate("/");
    } else {
      console.log("return error: ", error);
    }
  };

  return (
    <div className="pt_admin_lr">
      <div className="d-none">
        <Builty ref={builtyRef} data={updateData} />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col-7">
              <div className="container">
                <div className="row m-15 justify-between">
                  <div className="col-8">
                    <div className="form_control_wrapper">
                      <label>Place to send</label>
                      <select
                        name="place_to_send"
                        id="cars"
                        value={formik.values.place_to_send}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Place to Send...</option>
                        {branches &&
                          branches.map((branch) => (
                            <option value={branch?.place_to_send}>
                              {branch?.place_to_send}
                            </option>
                          ))}
                      </select>
                      {formik.touched.place_to_send &&
                        formik.errors.place_to_send && (
                          <div className="text-danger">
                            {formik.errors.place_to_send}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* <div className="col-4">
                    <ul className="d-flex gap-30 justify-content-end">
                      <li className="zn__main-menu-list">
                        <Link to="" className="btn btn-primary">
                          Edit
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                </div>
                <div className="row justify-between">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Sender Name</label>
                      <input
                        name="sender_name"
                        type="text"
                        value={formik.values.sender_name}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.sender_name &&
                        formik.errors.sender_name && (
                          <div className="text-danger">
                            {formik.errors.sender_name}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Sender Number</label>
                      <input
                        name="sender_number"
                        type="number"
                        value={formik.values.sender_number}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.sender_number &&
                        formik.errors.sender_number && (
                          <div className="text-danger">
                            {formik.errors.sender_number}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Receiver Name</label>
                      <input
                        name="receiver_name"
                        type="text"
                        value={formik.values.receiver_name}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.receiver_name &&
                        formik.errors.receiver_name && (
                          <div className="text-danger">
                            {formik.errors.receiver_name}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Receiver Number</label>
                      <input
                        name="receiver_number"
                        type="number"
                        value={formik.values.receiver_number}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.receiver_number &&
                        formik.errors.receiver_number && (
                          <div className="text-danger">
                            {formik.errors.receiver_number}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="row justify-between mt-30">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Item Details</label>
                      <select
                        name="item_detail"
                        id="cars"
                        value={formik.values.item_detail}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Item detail...</option>
                        {items &&
                          items.map((item) => (
                            <option value={item?.item_name}>
                              {item?.item_name}
                            </option>
                          ))}
                      </select>
                      {formik.touched.item_detail &&
                        formik.errors.item_detail && (
                          <div className="text-danger">
                            {formik.errors.item_detail}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Colors</label>
                      <select
                        name="color"
                        id="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Color...</option>
                        {colors &&
                          colors.map((item) => (
                            <option value={item?.color}>{item?.color}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row justify-between mt-30">
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Quantity Number</label>
                      <input
                        name="quantity"
                        type="number"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.quantity && formik.errors.quantity && (
                        <div className="text-danger">
                          {formik.errors.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Rate</label>
                      <input
                        name="rate"
                        type="number"
                        value={formik.values.rate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          formik.setFieldValue(
                            "total_amount",
                            formik.values.quantity * e.target.value
                          );
                        }}
                      />
                      {formik.touched.rate && formik.errors.rate && (
                        <div className="text-danger">{formik.errors.rate}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Total Amount</label>
                      <input
                        name="total_amount"
                        type="number"
                        disabled
                        value={formik.values.total_amount}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.total_amount &&
                        formik.errors.total_amount && (
                          <div className="text-danger">
                            {formik.errors.total_amount}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Payment Type</label>
                      <select
                        name="payment_type"
                        id="payment_type"
                        value={formik.values.payment_type}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Payment Type...</option>
                        <option value="To Pay">To Pay</option>
                        <option value="Paid">Paid</option>
                      </select>
                      {formik.touched.payment_type &&
                        formik.errors.payment_type && (
                          <div className="text-danger">
                            {formik.errors.payment_type}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="row justify-between align-items-end mt-30">
                  <div className="col-4">
                    <div className="form_control_wrapper">
                      <label>Remarks</label>
                      <input
                        name="remarks"
                        value={formik.values.remarks}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <button
                      onClick={onCancel}
                      // type="submit"
                      className="me-3 time_btn btn btn-submit btn-danger"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="pt__lr_num time_btn btn btn-submit"
                    >
                      Update & Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-25">
              <div className="pt__admin_charges">
                <table>
                  <tr>
                    <th width="50">Charges</th>
                    <th width="50"></th>
                  </tr>
                  <tr>
                    <td>Freight</td>
                    <td>{0}</td>
                  </tr>
                  <tr>
                    <td>LR Charge</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>{10}</td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td>{10}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LrEdit;
