
import { useState } from "react";

function ClinicDirectory({ clinics }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Search and filter using live clinic data
  const filteredClinics = clinics.filter((clinic) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      clinic.name.toLowerCase().includes(searchText) ||
      clinic.village.toLowerCase().includes(searchText) ||
      clinic.medicine.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "all" || clinic.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="inventory clinic-directory">
      <h2>🏥 Clinic Directory</h2>

      <p>
        Search healthcare centres and view medicine availability.
      </p>

      <input
        type="text"
        placeholder="Search clinic, village, or medicine..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxSizing: "border-box"
        }}
      />

      <div className="clinic-filter-buttons">
        {["all", "low", "surplus", "normal"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: "9px 16px",
              margin: "4px",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              background:
                filter === status ? "#176b57" : "#e8eeee",
              color:
                filter === status ? "white" : "#333"
            }}
          >
            {status === "all"
              ? "All Clinics"
              : status === "low"
              ? "Low Stock"
              : status === "surplus"
              ? "Surplus"
              : "Normal"}
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Clinic</th>
              <th>Village</th>
              <th>Medicine</th>
              <th>Stock</th>
              <th>Daily Usage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td>{clinic.name}</td>
                  <td>{clinic.village}</td>
                  <td>{clinic.medicine}</td>
                  <td>{clinic.stock} Packs</td>
                  <td>{clinic.dailyUsage} Packs</td>
                  <td>
                    <span className={clinic.status}>
                      {clinic.status === "low"
                        ? "Low Stock"
                        : clinic.status === "surplus"
                        ? "Surplus"
                        : "Normal"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No matching clinics found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p>
        Showing {filteredClinics.length} of {clinics.length} clinics
      </p>
    </section>
  );
}

export default ClinicDirectory;
