import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../supabase/supabaseClient";

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: true });
    if (!error) {
      setItems(data);
    }
  };

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
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Add Here"
                        className="form_control"
                      />
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          const { data, error } = await supabase
                            .from("items")
                            .insert({ item_name: itemName });
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
                      <th>Item</th>
                    </tr>
                    {items &&
                      items.map((item) => (
                        <tr>
                          <td>{item?.id}</td>
                          <td>{item?.item_name}</td>
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

export default ItemTable;
