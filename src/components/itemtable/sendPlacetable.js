import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";

const SendPlacetable = () => {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");

  useEffect(() => {
    getBranches();
  }, []);

  async function getBranches() {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setBranches(data);
    }
  }

  return (
    <>
      <section className="setItem">
        <div className="setitem_container">
          <div className="row">
            <div className="col-4">
              <div className="setitem_left">
                <ul>
                  <li>
                    <Link to="/setting/items"> Items </Link>
                  </li>
                  <li>
                    <Link to="/setting/color"> Color </Link>
                  </li>
                  <li>
                    <Link to="/setting/sendplace"> Place To Send </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-8">
              <div className="setitem_right">
                <div className="d-flex justify-content-end">
                  <div className="additem_form">
                    <form action="">
                      <input
                        type="text"
                        placeholder="Add Here"
                        className="form_control"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                      <button className="btn btn-primary" onClick={async() => {
                        const {data, error} = await supabase.from('branches').insert({branch_name: branch});
                        if(!error){
                            window.location.reload();
                        }
                      }}>Add</button>
                    </form>
                  </div>
                </div>
                <div className="additem_table">
                  <table cellPadding={0} cellSpacing={0}>
                    <tr>
                      <th>No.</th>
                      <th>Item</th>
                    </tr>
                    {branches && branches.map((branch) => (
                    <tr>
                      <td>{branch?.id}</td>
                      <td>{branch?.branch_name}</td>
                    </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SendPlacetable;
