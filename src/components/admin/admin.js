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
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaMoneyBillWave, FaPrint, FaTruck } from "react-icons/fa";

const Admin = () => {
  const [branches, setBranches] = useState([]);
  const [items, setItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("BRANCHES ADMIN>>", branches);
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
    const branchId = localStorage.getItem(CONSTANTS.BRANCH_ID);

    const { data, error } = await supabase
      .from("access_branch")
      .select("places")
      .eq("branch", branchId);

    if (error) {
      console.log("error: ", error);
      setBranches([]);
      return;
    }

    if (!data || data.length === 0) {
      setBranches([]);
      return;
    }

    const rawPlaces = data[0].places;
    // console.log("RAW PLACES FROM DB >>", rawPlaces);

    let list = [];

    if (Array.isArray(rawPlaces)) {
      // Your case: [ "[\"RAJKOT...\",\"AHMEDABAD...\"]" ]
      if (
        rawPlaces.length === 1 &&
        typeof rawPlaces[0] === "string" &&
        rawPlaces[0].trim().startsWith("[")
      ) {
        // parse the JSON string inside the array
        try {
          const parsed = JSON.parse(rawPlaces[0]);
          if (Array.isArray(parsed)) {
            list = parsed;
          } else {
            list = [rawPlaces[0]];
          }
        } catch (e) {
          console.error("Failed to parse places JSON string:", e);
          list = rawPlaces;
        }
      } else {
        // normal array of strings
        list = rawPlaces;
      }
    } else if (typeof rawPlaces === "string") {
      // just in case it's a plain JSON string without outer array
      try {
        const parsed = JSON.parse(rawPlaces);
        list = Array.isArray(parsed) ? parsed : [rawPlaces];
      } catch {
        list = [rawPlaces];
      }
    } else {
      list = [];
    }

    // console.log("FINAL PLACES LIST >>", list);
    setBranches(list);
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
        if (!loading) {
          // setLoading(true); // Removed to prevent stuck loading on validation error
          formik.handleSubmit(); // trigger formik submit
        }
      }
      event.preventDefault();
    }
  }

  const handlePlaceChange = async (e) => {
    const val = e.target.value;
    formik.setFieldValue("place_to_send", val);

    try {
      const { data, error } = await supabase
        .from("place_to_send")
        .select("address")
        .eq("place_to_send", val)
        .maybeSingle();

      if (!error && data) {
        console.log("ADDRESS FROM place_to_send >>", data.address);
        formik.setFieldValue("address", data.address || "");
      } else {
        formik.setFieldValue("address", "");
      }
    } catch (err) {
      console.error("Error fetching address for place:", err);
      formik.setFieldValue("address", "");
    }
  };

  return (
    <section className="pt__admin">
      <div className="d-none">
        <Builty
          ref={builtyRef}
          data={data}
          address={formik.values.address}
        />
      </div>

      <div className="container">
        {/* --- Header --- */}
        <div className="dashboard-header">
          <h2>
            New Parcel <span>Booking</span>
          </h2>
          <div className="header-actions">
            <div className="badge-status active">
              <span className="dot"></span> System Active
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>

          {/* --- Step 1: Destination Selection (First Priority) --- */}
          <div className="card-box mb-3" style={{ marginBottom: '20px' }}>
            <div className="card-header-modern">
              <h4><FaMapMarkerAlt className="me-2" /> Select Destination</h4>
            </div>
            <div className="card-body-modern" style={{ padding: '16px 20px' }}>
              <div className="form-group-modern" style={{ marginBottom: 0 }}>
                <div className={`input-wrapper ${formik.touched.place_to_send && formik.errors.place_to_send ? 'has-error' : ''}`}>
                  <select
                    name="place_to_send"
                    value={formik.values.place_to_send}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handlePlaceChange(e);
                    }}
                    onKeyDown={handleEnter}
                    style={{ height: '48px', fontSize: '16px' }} // Make it prominent
                    autoFocus
                  >
                    <option value="">Select Destination Branch / Station...</option>
                    {Array.isArray(branches) && branches.map((place, idx) => (
                      <option key={idx} value={place}>{place}</option>
                    ))}
                  </select>
                </div>
                {formik.touched.place_to_send && formik.errors.place_to_send && (
                  <div className="error-msg">{formik.errors.place_to_send}</div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">

            {/* 1. Sender Details */}
            <div className="card-box sender-card">
              <div className="card-header-modern">
                <h4><FaUser className="me-2" /> Sender Details</h4>
              </div>
              <div className="card-body-modern">
                <div className="grid-2-col">
                  <div className="form-group-modern">
                    <label>Sender Name</label>
                    <div className={`input-wrapper ${formik.touched.sender_name && formik.errors.sender_name ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="sender_name"
                        {...formik.getFieldProps('sender_name')}
                        onKeyDown={handleEnter}
                        placeholder="Enter Name"
                      />
                    </div>
                    {formik.touched.sender_name && formik.errors.sender_name && (
                      <div className="error-msg">{formik.errors.sender_name}</div>
                    )}
                  </div>
                  <div className="form-group-modern">
                    <label>Mobile Number</label>
                    <div className={`input-wrapper ${formik.touched.sender_number && formik.errors.sender_number ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="sender_number"
                        maxLength={10}
                        {...formik.getFieldProps('sender_number')}
                        onKeyDown={handleEnter}
                        placeholder="10-digit Mobile"
                      />
                    </div>
                    {formik.touched.sender_number && formik.errors.sender_number && (
                      <div className="error-msg">{formik.errors.sender_number}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Receiver Details */}
            <div className="card-box receiver-card">
              <div className="card-header-modern">
                <h4><FaUser className="me-2" /> Receiver Details</h4>
              </div>
              <div className="card-body-modern">
                <div className="grid-2-col">
                  <div className="form-group-modern">
                    <label>Receiver Name</label>
                    <div className={`input-wrapper ${formik.touched.receiver_name && formik.errors.receiver_name ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="receiver_name"
                        {...formik.getFieldProps('receiver_name')}
                        onKeyDown={handleEnter}
                        placeholder="Enter Name"
                      />
                    </div>
                    {formik.touched.receiver_name && formik.errors.receiver_name && (
                      <div className="error-msg">{formik.errors.receiver_name}</div>
                    )}
                  </div>
                  <div className="form-group-modern">
                    <label>Mobile Number</label>
                    <div className={`input-wrapper ${formik.touched.receiver_number && formik.errors.receiver_number ? 'has-error' : ''}`}>
                      <input
                        type="text"
                        name="receiver_number"
                        maxLength={10}
                        {...formik.getFieldProps('receiver_number')}
                        onKeyDown={handleEnter}
                        placeholder="10-digit Mobile"
                      />
                    </div>
                    {formik.touched.receiver_number && formik.errors.receiver_number && (
                      <div className="error-msg">{formik.errors.receiver_number}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Parcel Info */}
            <div className="card-box parcel-card">
              <div className="card-header-modern">
                <h4><FaBoxOpen className="me-2" /> Parcel Info</h4>
              </div>
              <div className="card-body-modern">
                <div className="form-group-modern">
                  <label>Item Description</label>
                  <div className={`input-wrapper ${formik.touched.item_detail && formik.errors.item_detail ? 'has-error' : ''}`}>
                    <select
                      name="item_detail"
                      {...formik.getFieldProps('item_detail')}
                      onKeyDown={handleEnter}
                    >
                      <option value="">Select Item...</option>
                      {items && items.map((item) => (
                        <option key={item.id} value={item.item_name}>
                          {item.item_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.item_detail && formik.errors.item_detail && (
                    <div className="error-msg">{formik.errors.item_detail}</div>
                  )}
                </div>

                <div className="grid-2-col">
                  <div className="form-group-modern">
                    <label>Quantity</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="quantity"
                        {...formik.getFieldProps('quantity')}
                        onKeyDown={handleEnter}
                        placeholder="Qty"
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label>Rate (₹)</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="rate"
                        value={formik.values.rate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          formik.setFieldValue(
                            "total_amount",
                            formik.values.quantity * e.target.value
                          );
                        }}
                        onKeyDown={handleEnter}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-modern">
                  <label>Remarks / Notes</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="remarks"
                      {...formik.getFieldProps('remarks')}
                      onKeyDown={handleEnter}
                      placeholder="Optional remarks..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Payment Details */}
            <div className="card-box payment-card">
              <div className="card-header-modern">
                <h4><FaMoneyBillWave className="me-2" /> Payment Details</h4>
              </div>
              <div className="card-body-modern">

                <div className="form-group-modern">
                  <label>Payment Type</label>
                  <div className="payment-actions">
                    <div
                      className={`btn-payment-option ${formik.values.payment_type === 'To Pay' ? 'selected-topay' : ''}`}
                      onClick={() => formik.setFieldValue("payment_type", "To Pay")}
                    >
                      To Pay
                    </div>
                    <div
                      className={`btn-payment-option ${formik.values.payment_type === 'Paid' ? 'selected-paid' : ''}`}
                      onClick={() => formik.setFieldValue("payment_type", "Paid")}
                    >
                      Paid
                    </div>
                  </div>
                  {formik.touched.payment_type && formik.errors.payment_type && (
                    <div className="error-msg" style={{ marginTop: '-15px', marginBottom: '10px' }}>{formik.errors.payment_type}</div>
                  )}
                </div>

                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Freight Charges</span>
                    <span>₹ {formik.values.total_amount || 0}</span>
                  </div>
                  <div className="summary-row">
                    <span>LR Charge</span>
                    <span>₹ 10</span>
                  </div>
                  <div className="summary-row total">
                    <span>Grand Total</span>
                    <span>₹ {Number(formik.values.total_amount || 0) + 10}</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-submit-modern"
                    onKeyDown={handleEnter}
                  >
                    {loading ? (
                      <>Processing <Loader /></>
                    ) : (
                      <><FaPrint /> PRINT & SAVE</>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </section>
  );
};

export default Admin;
