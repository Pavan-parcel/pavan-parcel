import React, { forwardRef } from 'react'
import { CONSTANTS } from '../utils/contants'
import moment from 'moment'

const Builty = forwardRef((props, ref) => {
    // console.log("props data: ", props?.data)
    let branch = "";
    if(localStorage.getItem(CONSTANTS.BRANCH).includes("(HO)")){
        branch = "HO/"
    } else if(localStorage.getItem(CONSTANTS.BRANCH).includes("(SA)")){
        branch = "SA/"
    } else if(localStorage.getItem(CONSTANTS.BRANCH).includes("(KA)")){
        branch = "KA/"
    }
    return (
        <div ref={ref} className='builty_table'>
                <table cellPadding={0} cellSpacing={0}>
                    <tr>
                        <td>
                            LR No. : {branch+props?.data[0]?.id} <br />
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
                            LR No. : {branch+props?.data[0]?.id} <br />
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
                </table>
            </div>
    )
})

export default Builty