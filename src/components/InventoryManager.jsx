
function InventoryManager({ clinics, onUpdateClinic }) {
  return (
    <section className="inventory">
      <h2>✏️ Live Inventory Management</h2>

      <p>
        Update medicine stock and daily usage for each clinic.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Clinic</th>
              <th>Medicine</th>
              <th>Available Stock</th>
              <th>Daily Usage</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.id}>
                <td>{clinic.name}</td>
                <td>{clinic.medicine}</td>

                <td>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={clinic.stock}
                    onChange={(event) =>
                      onUpdateClinic(
                        clinic.id,
                        "stock",
                        event.target.value
                      )
                    }
                    style={{
                      width: "90px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "6px"
                    }}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={clinic.dailyUsage}
                    onChange={(event) =>
                      onUpdateClinic(
                        clinic.id,
                        "dailyUsage",
                        event.target.value
                      )
                    }
                    style={{
                      width: "90px",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "6px"
                    }}
                  />
                </td>

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
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "13px", color: "#777" }}>
        Changes are reflected immediately in the dashboard.
      </p>
    </section>
  );
}

export default InventoryManager;
