import React, { useEffect, useState } from "react";
import AdminSidebar from "../adminSidebar/adminSidebar";
import supabase from "../../supabase/supabaseClient";
import toast from "react-hot-toast";

const Address = () => {
  const [branchSelected, setBranchSelected] = useState(""); // holds branch id
  const [addressLine, setAddressLine] = useState("");
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all branches (with address column)
  async function getBranches() {
    setLoadingBranches(true);
    const { data, error } = await supabase
      .from("place_to_send")
      .select("*")
      .order("id", { ascending: true });

    setLoadingBranches(false);

    if (error) {
      console.error("Failed to fetch branches:", error);
      // toast.error("Failed to load branches");
      return;
    }
    setBranches(data || []);
  }

  useEffect(() => {
    getBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!branchSelected) {
      toast.error("Please select a branch");
      return;
    }
    if (!addressLine.trim()) {
      toast.error("Please enter an address");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("place_to_send")
        .update({
          address: addressLine.trim(), // 👈 new column in place_to_send
        })
        .eq("id", branchSelected);

      setSaving(false);

      if (error) {
        console.error("Failed to update address:", error);
        toast.error("Failed to save address");
        return;
      }

      toast.success("Address saved successfully");
      setAddressLine("");
      setBranchSelected("");
      await getBranches();
    } catch (err) {
      setSaving(false);
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  // Branches which already have an address
  const branchesWithAddress = branches.filter(
    (b) => b.address && String(b.address).trim() !== ""
  );

  // Branches which DON'T have an address yet → for dropdown
  const branchesWithoutAddress = branches.filter(
    (b) => !b.address || String(b.address).trim() === ""
  );

  return (
    <section className="setItem">
      <div className="setitem_container">
        <div className="row">
          <div className="col-4">
            <AdminSidebar />
          </div>

          <div className="col-8">
            <div className="setitem_right">
              <h3>Address</h3>

              <form
                className="d-flex flex-column gap-3 mt-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="form-label">Branches</label>
                  <select
                    className="form-select"
                    value={branchSelected}
                    onChange={(e) => setBranchSelected(e.target.value)}
                  >
                    <option value="">Select Branch</option>
                    {branchesWithoutAddress.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.place_to_send}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control form-control-lg border"
                    placeholder="Enter address line"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!branchSelected || !addressLine.trim() || saving}
                  >
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>

              <div className="mt-4">
                <h5>Saved Addresses</h5>

                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>#</th>
                        <th style={{ width: "35%" }}>Branch</th>
                        <th style={{ width: "50%" }}>Address</th>
                        <th style={{ width: "10%" }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {loadingBranches ? (
                        <tr>
                          <td colSpan={4}>Loading...</td>
                        </tr>
                      ) : branchesWithAddress.length === 0 ? (
                        <tr>
                          <td colSpan={4}>No addresses found</td>
                        </tr>
                      ) : (
                        branchesWithAddress.map((b, idx) => (
                          <tr key={b.id}>
                            <td>{idx + 1}</td>
                            <td>{b.place_to_send}</td>
                            <td>{b.address}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={async () => {
                                  const should = window.confirm(
                                    "Delete this address?"
                                  );
                                  if (!should) return;

                                  const { error } = await supabase
                                    .from("place_to_send")
                                    .update({ address: null }) // or "" if you prefer
                                    .eq("id", b.id);

                                  if (error) {
                                    console.error("Failed to delete:", error);
                                    toast.error("Failed to delete address");
                                  } else {
                                    toast.success("Address deleted");
                                    getBranches();
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Address;
