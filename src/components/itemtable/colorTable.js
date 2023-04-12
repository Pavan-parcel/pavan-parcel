import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";

const ColorTable = () => {
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState("");

  useEffect(() => {
    getColors();
  }, []);

  async function getColors() {
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setColors(data);
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
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Add Here"
                        className="form_control"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          const { data, error } = await supabase
                            .from("colors")
                            .insert({ color: color });
                            if(!error){
                                window.location.reload();
                            }
                        }}
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>
                <div className="additem_table">
                  <table cellPadding={0} cellSpacing={0}>
                    <tr>
                      <th>No.</th>
                      <th>Color</th>
                    </tr>
                    {colors &&
                      colors.map((color) => (
                        <tr>
                          <td>{color?.id}</td>
                          <td>{color?.color}</td>
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

export default ColorTable;
