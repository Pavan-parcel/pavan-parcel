import React from 'react'
import { Link } from 'react-router-dom'

const Manual = () => {
  return (
    <div className="pt_admin_lr">
      <form>
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
                      >
                        <option value="">Select Place to Send...</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form_control_wrapper">
                      <label>LR No.</label>
                      <input
                        name="sender_name"
                      />
                    </div>
                  </div>
                </div>
                <div className="row justify-between">
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Sender Name</label>
                      <input
                        name="sender_name"
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Sender Number</label>
                      <input
                        name="sender_number"
                      />
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Receiver Name</label>
                      <input
                        name="receiver_name"
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form_control_wrapper">
                      <label>Receiver Number</label>
                      <input
                        name="receiver_number"
                      />
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
                      >
                        <option value="">Select Item detail...</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-30">
                    <div className="form_control_wrapper">
                      <label>Colors</label>
                      <select
                        name="color"
                        id="color"
                      >
                        <option value="">Select Color...</option>
                        <option value="Red">Red</option>
                        <option value="Green">Green</option>
                        <option value="Blue">Blue</option>
                        <option value="Cyan">Cyan</option>
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
                      />
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Rate</label>
                      <input
                        name="rate"
                      />
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Total Amount</label>
                      <input
                        name="total_amount"
                      />
                    </div>
                  </div>
                  <div className="col-25">
                    <div className="form_control_wrapper">
                      <label>Payment Type</label>
                      <select
                        name="payment_type"
                        id="payment_type"
                      >
                        <option value="">Select Payment Type...</option>
                        <option value="To Pay">To Pay</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row justify-between align-items-end mt-30">
                  <div className="col-4">
                    <div className="form_control_wrapper">
                      <label>Remarks</label>
                      <input
                        name="remarks"
                      /> 
                    </div>
                  </div>
                  <div className="col-4 text-end">
                    <button
                      type="submit"
                      className="pt__lr_num time_btn btn btn-submit"
                    >
                      Save
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
  )
}

export default Manual