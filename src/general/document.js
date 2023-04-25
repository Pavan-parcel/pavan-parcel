import React, { forwardRef } from "react";
import "./style.css";
import moment from "moment";

export const Document = forwardRef((props, ref) => {

  const getTotal = () => {
    var quantity = 0;
    var total_amount = 0;
    var paid = 0;
    var to_pay = 0;
  
    for (let i = 0; i < props?.data?.length; i++) {
      quantity += Number(props?.data[i].quantity);
      total_amount += Number(props?.data[i].total_amount);
      if(props?.data[i]?.payment_type === 'Paid'){
        paid += Number(props?.data[i].total_amount)
      }
      if(props?.data[i]?.payment_type === 'To Pay'){
        to_pay += Number(props?.data[i].total_amount)
      }
    }
    return {quantity: quantity, total_amount: total_amount, paid: paid, to_pay: to_pay};
  }

  const {quantity, total_amount, paid, to_pay} = getTotal();

  return (
    <div ref={ref} className="booking_report">
      <div className="booking_report_title">
        <h4>Pavan Transport Company</h4>
        <p>
          Address: KRISHNA NAGAR SOCIRTY, BESIDE LAXMI HOTEL, OPPDOCTOR HOUSE,
          NR HIRABAUGH
        </p>
        <h5>Booking Register Report</h5>
      </div>
      <p>Date: {moment(props?.dates?.startDate).format('DD-MM-YYYY') + " - " + moment(props?.dates?.endDate).format('DD-MM-YYYY')}</p>

      <div className="booking_report_table">
        <table cellPadding={0} cellSpacing={0}>
          <tr>
            <th>SR...</th>
            <th>LR NUM...</th>
            <th>LR Type</th>
            <th>Dest</th>
            <th>Sender</th>
            <th>Reciever</th>
            <th>Reciever No.</th>
            <th>Art</th>
            <th>Art Type</th>
            <th>Total</th>
          </tr>
          {props.data &&
            props.data.map((parcel, index) => (
              <tr>
                <td>{index + 1}</td>
                <td> {parcel?.id}</td>
                <td>{parcel?.payment_type}</td>
                <td>{parcel?.place_to_send}</td>
                <td>{parcel?.sender_name}</td>
                <td>{parcel?.receiver_name}</td>
                <td>{parcel?.receiver_number}</td>
                <td>{parcel?.quantity}</td>
                <td>{parcel?.item_detail}</td>
                <td>{parcel?.total_amount}</td>
              </tr>
            ))}
          <tr>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>{quantity}</th>
            <th>-</th>
            <th>Paid : {paid} <br/> To Pay : {to_pay} </th>
          </tr>
        </table>
      </div>
    </div>
  );
});
