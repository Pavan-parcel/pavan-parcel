import React, { useRef } from "react";
import { Document } from "../../general/document";
import { Link, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BottomDoc from "../../general/bottomDoc";

const General = () => {

    const generalRef = useRef();
    const {state} = useLocation();
    const {data, dates} = state;

    const handlePrint = useReactToPrint({
        content: () => generalRef.current
    })

  return (
    <>
      <Document ref={generalRef} data={data} dates={dates} />
      {/* <BottomDoc /> */}
      <div className="d-flex align-items-center justify-content-center my-4">
        <button className="btn btn-primary" onClick={handlePrint}>
            Print
        </button>
      </div>
    </>
  );
};

export default General;
