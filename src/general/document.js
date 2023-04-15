import React, { forwardRef } from "react";
import "./style.css";

export const Document = forwardRef((props, ref) => (
  <div ref={ref} className="booking_report">
    <div className="booking_report_title">
      <h4>Pavan Transport Company</h4>
      <p>
        Address: KRISHNA NAGAR SOCIRTY, BESIDE LAXMI HOTEL, OPPDOCTOR HOUSE, NR
        HIRABAUGH
      </p>
      <h5>Booking Register Report</h5>
    </div>
    <p>Date: 27-02-2023 - 28-02-2023</p>

    <div className="booking_report_table">
      <table cellPadding={0} cellSpacing={0}>
        <tr>
          <th>SR...</th>
          <th>LR NUM...</th>
          <th>LR Type</th>
          <th>Dest</th>
          <th>c/nor</th>
          <th>c/nee</th>
          <th>Art</th>
          <th>Art Type</th>
          <th>Total</th>
        </tr>
        {props.data &&
          props.data.map((parcel, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{parcel?.id}</td>
              <td>{parcel?.payment_type}</td>
              <td>{parcel?.place_to_send}</td>
              <td>{parcel?.sender_name}</td>
              <td>{parcel?.receiver_name}</td>
              <td>{parcel?.quantity}</td>
              <td>{parcel?.item_detail}</td>
              <td>{parcel?.total_amount}</td>
            </tr>
          ))}
      </table>
    </div>
  </div>
));
