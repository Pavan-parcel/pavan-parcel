import React, { useEffect, useRef, useState } from "react";
import "./admin.sass";
import supabase from "../../supabase/supabaseClient.js";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { CONSTANTS } from "../../utils/contants";
import Builty from "../../builty/builty";
import { useReactToPrint } from "react-to-print";
import Loader from "../loader/loader";

const Admin = () => {
  const [branches, setBranches] = useState([]);
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const builtyRef = useRef();

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
    quantity: Yup.string().required("Please enter qunatity"),
    rate: Yup.string().required("Please enter rate"),
    total_amount: Yup.string().required("Please enter total amount"),
    payment_type: Yup.string().required("Please select Payment type"),
    place_to_send: Yup.string().required("Please select Place to Send"),
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
      address: "", // 👈 only in React, not in DB
      remarks: "",
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const form = await supabase
          .from("forms")
          .select("*")
          .eq("branch_name", localStorage.getItem(CONSTANTS.BRANCH));

        if (!form.data || form.data.length === 0) {
          throw new Error("Form config not found");
        }

        // branch prefix for receipt no
        let branchPrefix = "";
        const branchStr = localStorage.getItem(CONSTANTS.BRANCH) || "";
        if (branchStr.includes("(HO)")) branchPrefix = "HO/";
        else if (branchStr.includes("SA")) branchPrefix = "SA/";
        else if (branchStr.includes("KA")) branchPrefix = "KA/";
        else if (branchStr.includes("(BHI)")) branchPrefix = "BHI/";
        else if (branchStr.includes("(BO)")) branchPrefix = "BO/";
        else if (branchStr.includes("(GH)")) branchPrefix = "GH/";
        else if (branchStr.includes("(AN)")) branchPrefix = "AN/";
        else if (branchStr.includes("(PU)")) branchPrefix = "PU/";
        else if (branchStr.includes("(LI)")) branchPrefix = "LI/";
        else if (branchStr.includes("(BA)")) branchPrefix = "BA/";
        else if (branchStr.includes("(PA)")) branchPrefix = "PA/";
        else if (branchStr.includes("(SET)")) branchPrefix = "SET/";

        const currentFormNo = form.data[0]?.form_no;

        // ❌ we DON'T want to send "address" to parcels (no such column)
        const { address, ...restValues } = values;

        const { data: inserted, error } = await supabase
          .from("parcels")
          .insert({
            ...restValues, // everything except address
            id: currentFormNo,
            receipt_no: branchPrefix + currentFormNo,
            total_amount: Number(values.total_amount) + 10,
            branch: localStorage.getItem(CONSTANTS.BRANCH),
            // address is NOT sent, because parcels table doesn't have it
          })
          .select("*");

        if (error) {
          console.log("insert error: ", error);
          throw new Error(error.message);
        }

        // update form no
        const { error: updateErr } = await supabase
          .from("forms")
          .update({ form_no: currentFormNo + 1 })
          .eq("branch_name", localStorage.getItem(CONSTANTS.BRANCH));

        if (updateErr) {
          console.log("form update error: ", updateErr);
        }

        setData(inserted || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    getBranches();
    getItems();
    getColors();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => builtyRef.current,
  });

  useEffect(() => {
    if (data.length > 0) {
      handlePrint();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [data, handlePrint]);

  // 🔹 Get from place_to_send (has place_to_send + address)
  const getBranches = async () => {
    const { data, error } = await supabase
      .from("place_to_send")
      .select("id, place_to_send, address")
      .order("id", { ascending: true });

    if (!error) {
      setBranches(data || []);
    } else {
      console.log("error: ", error);
    }
  };

  const getItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (!error) {
      setItems(data);
    } else {
      console.log("error: ", error);
    }
  };

  async function getColors() {
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setColors(data);
    }
  }

  function handleEnter(event) {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const elements = form.elements;
      const index = Array.prototype.indexOf.call(elements, event.target);
      let nextIndex = index + 1;
      while (nextIndex < elements.length && elements[nextIndex].disabled) {
        nextIndex++;
      }
      if (nextIndex < elements.length - 1) {
        elements[nextIndex].focus();
      } else {
        !loading && formik.handleSubmit(event);
      }
      event.preventDefault();
    }
  }

  const handlePlaceChange = (e) => {
    const val = e.target.value;
    formik.setFieldValue("place_to_send", val);

    // 🔹 find selected branch and set address into formik (for printing)
    const branchObj = branches.find((b) => b.place_to_send === val);
    const addr = branchObj?.address || "";
    console.log("Branch OBJ", branchObj);
    formik.setFieldValue("address", addr);
  };

  return (
    <section className="pt__admin">
      {/* Builty will get address from formik (NOT from parcels table) */}
      <div className="d-none">
        <Builty
          ref={builtyRef}
          data={data}
          address={formik.values.address} // 👈 comes from place_to_send via handlePlaceChange
        />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col-7">
              <div className="container">
                <div className="row justify-between">
                  <div className="col-4">
                    <ul className="d-flex gap-30">
                      <li className="zn__main-menu-list">
                        <Link
                          to=""
                          onClick={() =>
                            formik.setFieldValue("payment_type", "To Pay")
                          }
                          className="btn btn-primary"
                        >
                          To Pay
                        </Link>
                      </li>
                      <li className="zn__main-menu-list">
                        <Link
                          to=""
                          onClick={() =>
                            formik.setFieldValue("payment_type", "Paid")
                          }
                          className="btn btn-primary"
                        >
                          Paid
                        </Link>
                      </li>
                      <li className="zn__main-menu-list">
                        <Link to="/manual" className="btn btn-primary">
                          Manual
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="row m-15 justify-between">
                  <div className="col-8">
                    <div className="form_control_wrapper">
                      <label>Place to send</label>
                      <select
                        onKeyDown={handleEnter}
                        name="place_to_send"
                        value={formik.values.place_to_send}
                        onChange={handlePlaceChange} // 👈 custom handler
                      >
                        <option value="">Select Place to Send...</option>
                        {branches &&
                          branches.map((branch) => (
                            <option
                              key={branch.id}
                              value={branch.place_to_send}
                            >
                              {branch.place_to_send}
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
                </div>

                <div className="row justify-between">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Sender Name</label>
                      <input
                        type="text"
                        onKeyDown={handleEnter}
                        name="sender_name"
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
                        type="text"
                        onKeyDown={handleEnter}
                        name="sender_number"
                        maxLength={10}
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
                        type="text"
                        onKeyDown={handleEnter}
                        name="receiver_name"
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
                        type="text"
                        onKeyDown={handleEnter}
                        name="receiver_number"
                        value={formik.values.receiver_number}
                        onChange={formik.handleChange}
                        maxLength={10}
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
                        onKeyDown={handleEnter}
                        name="item_detail"
                        value={formik.values.item_detail}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select Item detail...</option>
                        {items &&
                          items.map((item) => (
                            <option key={item.id} value={item.item_name}>
                              {item.item_name}
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
                </div>

                <div className="row justify-between mt-30">
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Quantity Number</label>
                      <input
                        onKeyDown={handleEnter}
                        type="number"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                      />
                      {formik.touched.quantity &&
                        formik.errors.quantity && (
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
                        onKeyDown={handleEnter}
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
                        <div className="text-danger">
                          {formik.errors.rate}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Total Amount</label>
                      <input
                        onKeyDown={handleEnter}
                        disabled
                        name="total_amount"
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
                        disabled
                        onKeyDown={handleEnter}
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
                        onKeyDown={handleEnter}
                        name="remarks"
                        value={formik.values.remarks}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end align-items-center text-end">
                    <button
                      onKeyDown={handleEnter}
                      type="submit"
                      disabled={loading}
                      className="pt__lr_num print_button time_btn btn btn-submit"
                    >
                      {loading ? "Please wait" : "Print and Save"}
                      {loading && <Loader />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-25">
              <div className="pt__admin_charges">
                <table>
                  <tbody>
                    <tr>
                      <th width="50">Charges</th>
                      <th width="50"></th>
                    </tr>
                    <tr>
                      <td>Freight</td>
                      <td>{formik.values.total_amount || 0}</td>
                    </tr>
                    <tr>
                      <td>LR Charge</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{Number(formik.values.total_amount) + 10}</td>
                    </tr>
                    <tr>
                      <td>Grand Total</td>
                      <td>{Number(formik.values.total_amount) + 10}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </form>
    </section>
  );
};

export default Admin;
