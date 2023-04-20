import React, { useRef } from "react";
import { Document } from "../../general/document";
import { Link, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

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
      <div className="d-flex align-items-center justify-content-center">
        <button className="btn btn-primary" onClick={handlePrint}>
            Print
        </button>
      </div>
    </>
  );
};

export default General;
