import React, { forwardRef, useEffect, useState } from "react";
import { CONSTANTS } from "../utils/contants";
import moment from "moment";
import supabase from '../supabase/supabaseClient';
import toast from 'react-hot-toast';



import "./builty.css";

const Builty = forwardRef((props, ref) => {

  const [address, setAddress] = useState("test")
  const [placeToSend, setPlaceToSend] = useState("");
  async function getBranches() {
    const { data, error } = await supabase
      .from("place_to_send")
      .select("*")
      .eq("address", `${props.data?.[0]?.place_to_send}`);
    if (error) {
      console.error("Failed to fetch branches:", error);
      toast.error("Failed to load branches");
      return;
    }
  }
  useEffect(() => {
    getBranches()
  }, [])



  let branch = "";
  if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(HO)")) {
    branch = "HO/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(SA)")) {
    branch = "SA/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(KA)")) {
    branch = "KA/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(BHI)")) {
    branch = "BHI/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(BO)")) {
    branch = "BO/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(GH)")) {
    branch = "GH/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(AN)")) {
    branch = "AN/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(PU)")) {
    branch = "PU/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(LI)")) {
    branch = "LI/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(BA)")) {
    branch = "BA/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(PA)")) {
    branch = "PA/";
  } else if (localStorage.getItem(CONSTANTS.BRANCH)?.includes("(SET)")) {
    branch = "SET/";
  }
  return (
    <div ref={ref} className="builty_table">
      <table cellPadding="0" cellSpacing="0">
        <tr>
          <th rowSpan="2" className="text-start">
            FROM : {props?.data[0]?.branch} <br />
            Mo.No.{" "}
            {props?.data[0]?.branch.includes("(HO)")
              ? "(7567529600)"
              : props?.data[0]?.branch.includes("(KA)")
                ? "(7405194000)"
                : props?.data[0]?.branch.includes("(SA)")
                  ? "(7567545800)"
                  : props?.data[0]?.branch.includes("(BO)")
                    ? "(8450905454)"
                    : props?.data[0]?.branch.includes("(BA)")
                      ? "(7567529300)"
                      : props?.data[0]?.branch.includes("(PA)")
                        ? "(9825036336, 794005352)"
                        : ""}
          </th>
          <th rowSpan="2" className="text-start">
            TO : {props?.data[0]?.place_to_send} <br />
            Mo.No.{" "}
            {props?.data[0]?.place_to_send?.includes("RAJKOT(LIMDA CHOK)")
              ? "(9408847247)"
              : props?.data[0]?.place_to_send?.includes("RAJKOT(PUNITNAGAR)")
                ? "(8460005334)"
                : props?.data[0]?.place_to_send?.includes("MUMBAI(BORIVALI)")
                  ? "(8450905454)"
                  : "(-)"}
          </th>
          <th className="text-start">LR NO. :</th>
          <th className="text-end">
            <b> {props?.data[0]?.receipt_no} </b>
          </th>
        </tr>
        <tr>
          <th className="text-start">LR Type:</th>
          <th className="text-end">
            <b>{props?.data[0]?.payment_type}</b>
          </th>
        </tr>
        <tr>
          <th rowSpan="2" className="text-start">
            SENDER : {props?.data[0]?.sender_name}
            <br />
            No. ({props?.data[0]?.sender_number} )
          </th>
          <th rowSpan="2" className="text-start">
            RECIEVER : {props?.data[0]?.receiver_name} <br />
            No. ({props?.data[0]?.receiver_number})
          </th>
          <th className="text-start">Freight:</th>
          <th className="text-end">{Number(props?.data[0]?.total_amount) - 10}</th>
        </tr>
        <tr>
          <th className="text-start">LR Charge:</th>
          <th className="text-end">10</th>
        </tr>
        <tr>
          <th colSpan="2" rowSpan="2" className="text-start">
            PKGS :{" "}
            <b>
              {props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}
            </b>
          </th>
        </tr>
        <tr>
          <th colSpan="2" rowSpan="2">
            -
          </th>
        </tr>
        <tr>
          <th colSpan="2" className="text-start">
            Remark : {props?.data[0]?.remarks}
          </th>
        </tr>
        <tr>
          <th colSpan="2" className="text-start">
            Booking Time :{" "}
            {moment(props?.data[0]?.created_at).format("DD/MM/YYYY h:mm a")}
          </th>
          <th className="text-start">Total</th>
          <th className="text-end">
            <b>{props?.data[0]?.total_amount}</b>
          </th>
        </tr>
        <tr>
          <th colSpan="6" className="text-start">
            Deliver Address : {props.address}
            {/* {moment(props?.data[0]?.created_at).format("DD/MM/YYYY h:mm a")} */}
          </th>

        </tr>
        {/* <tr>
                <th colSpan="4" className="text-start">
                    Deliver Address: <br/>
                    RATNAMANI COMPLEX BESIDE STAR BAZAR SATELITE
                </th>
            </tr> */}
      </table>

      {/* 
                <table cellPadding={0} cellSpacing={0} className='m-3'>
                    <tr>
                        <td>
                            LR No. :   <b> {branch+props?.data[0]?.id} </b> <br />
                            {localStorage.getItem(CONSTANTS.BRANCH)} - {props?.data[0]?.place_to_send} <br />
                            Sender : {props?.data[0]?.sender_name} <br />
                            Sender No. : {props?.data[0]?.sender_number} <br />
                            Reciever : {props?.data[0]?.receiver_name} <br />
                            Reciever No. : {props?.data[0]?.receiver_number} <br />
                            Item Type : <b>{props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}</b> <br />
                            Remark : {props?.data[0]?.remarks}<br />
                            Booking Time : {moment(props?.data[0]?.created_at).format('DD/MM/YYYY h:mm a')} <br />
                            Delivery Address : {props?.data[0]?.place_to_send} <br />
                            Freight : {Number(props?.data[0]?.total_amount) - 10} <br />
                            L.R. Charge : 10 <br />
                            Grand Total : <b>{props?.data[0]?.total_amount}</b> <br />
                            <p><b>{props?.data[0]?.payment_type}</b></p>
                        </td>
                        <td>
                            LR No. :<b> {branch+props?.data[0]?.id} </b><br />
                            {localStorage.getItem(CONSTANTS.BRANCH)} - {props?.data[0]?.place_to_send} <br />
                            Sender : {props?.data[0]?.sender_name} <br />
                            Sender No. : {props?.data[0]?.sender_number} <br />
                            Reciever : {props?.data[0]?.receiver_name} <br />
                            Reciever No. : {props?.data[0]?.receiver_number} <br />
                            Item Type : <b>{props?.data[0]?.quantity + " " + props?.data[0]?.item_detail}</b> <br />
                            Remark : {props?.data[0]?.remarks}<br />
                            Booking Time : {moment(props?.data[0]?.created_at).format('DD/MM/YYYY h:mm a')} <br />
                            Delivery Address : {props?.data[0]?.place_to_send} <br />
                            Freight : {Number(props?.data[0]?.total_amount) - 10} <br />
                            L.R. Charge : 10 <br />
                            Grand Total : <b>{props?.data[0]?.total_amount}</b> <br />
                            <p><b>{props?.data[0]?.payment_type}</b></p>
                        </td>
                    </tr>
                </table> */}
    </div>
  );
});

export default Builty;
