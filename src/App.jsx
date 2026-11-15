
import { useEffect, useState } from 'react';
import InventoryManager from './components/InventoryManager';
import ClinicDirectory from './components/ClinicDirectory';
import ShortageTrendChart from './components/ShortageTrendChart';
import InventoryChart from './components/InventoryChart';
import TransferRecommendations from './components/TransferRecommendations';
import ClinicMap from './components/ClinicMap';
import { clinics as initialClinics } from './data/clinics';
import './App.css';

function App() {

  // Load saved clinic data from browser, or use initial data
  const [clinics, setClinics] = useState(() => {
    try {
      const savedClinics = localStorage.getItem("pulsechain-clinics");

      if (savedClinics) {
        const parsedClinics = JSON.parse(savedClinics);

        if (Array.isArray(parsedClinics)) {
          return parsedClinics;
        }
      }
    } catch (error) {
      console.error("Error loading saved clinic data:", error);
    }

    return initialClinics;
  });

  // Automatically save clinic data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "pulsechain-clinics",
        JSON.stringify(clinics)
      );
    } catch (error) {
      console.error("Error saving clinic data:", error);
    }
  }, [clinics]);

  // Update clinic inventory
  const updateClinic = (id, field, value) => {
    const numericValue = Number(value);

    if (
      value === "" ||
      !Number.isFinite(numericValue) ||
      numericValue < 0 ||
      !Number.isInteger(numericValue)
    ) {
      return;
    }

    setClinics((previousClinics) =>
      previousClinics.map((clinic) => {
        if (clinic.id !== id) {
          return clinic;
        }

        const updatedClinic = {
          ...clinic,
          [field]: numericValue
        };

        // Automatically calculate stock status
        let status;

        if (updatedClinic.stock <= 20) {
          status = "low";
        } else if (updatedClinic.stock >= 80) {
          status = "surplus";
        } else {
          status = "normal";
        }

        return {
          ...updatedClinic,
          status
        };
      })
    );
  };

  // Calculate dashboard statistics automatically
  const totalClinics = clinics.length;

  const lowStockClinics = clinics.filter(
    (clinic) => clinic.status === "low"
  );

  const surplusClinics = clinics.filter(
    (clinic) => clinic.status === "surplus"
  );

  const swapSuggestions =
    lowStockClinics.length * surplusClinics.length;

  // Predict how many days medicine will last
  const medicinePredictions = clinics.map((clinic) => {
    const daysRemaining =
      clinic.dailyUsage > 0
        ? Math.floor(clinic.stock / clinic.dailyUsage)
        : null;

    return {
      ...clinic,
      daysRemaining,
      prediction:
        daysRemaining === null
          ? "Unknown"
          : daysRemaining <= 7
          ? "Shortage Expected"
          : "Stock Sufficient"
    };
  });

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>💊 PulseChain AI</h2>
        <p className="tagline">Healthcare Intelligence</p>

        <nav>
          <a className="active">▦ Dashboard</a>
          <a>🏥 Clinics</a>
          <a>💊 Medicine Inventory</a>
          <a>⚠️ Alerts</a>
          <a>🔄 Medicine Swaps</a>
          <a>🗺️ Clinic Map</a>
        </nav>

        <div className="sidebar-footer">
          AI Powered Healthcare
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to PulseChain AI Healthcare System</p>
          </div>

          <div className="status">● System Online</div>
        </header>

        {/* Dynamic Statistics */}
        <section className="stats">

          <div className="stat-card">
            <span>🏥</span>
            <h3>Total Clinics</h3>
            <h2>{totalClinics}</h2>
            <p>Connected healthcare centres</p>
          </div>

          <div className="stat-card danger">
            <span>⚠️</span>
            <h3>Low Stock Alerts</h3>
            <h2>{lowStockClinics.length}</h2>
            <p>Clinics need medicines</p>
          </div>

          <div className="stat-card success">
            <span>💊</span>
            <h3>Surplus Clinics</h3>
            <h2>{surplusClinics.length}</h2>
            <p>Clinics have extra stock</p>
          </div>

          <div className="stat-card info">
            <span>🔄</span>
            <h3>Swap Suggestions</h3>
            <h2>{swapSuggestions}</h2>
            <p>Possible clinic transfer pairs</p>
          </div>

        </section>

        {/* Dynamic Medicine Inventory */}
        <section className="inventory">
          <h2>Medicine Inventory</h2>
          <p>Overview of medicine availability across clinics.</p>

          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Clinic</th>
                <th>Available Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {clinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td>{clinic.medicine}</td>
                  <td>{clinic.name}</td>
                  <td>{clinic.stock} Packs</td>
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
        </section>

        {/* Live Inventory Management */}
        <InventoryManager
          clinics={clinics}
          onUpdateClinic={updateClinic}
        />

        {/* Interactive Clinic Directory */}
        <ClinicDirectory clinics={clinics} />

        {/* Medicine Inventory Analytics Chart */}
        <InventoryChart clinics={clinics} />

        {/* Automatic Low Stock Alerts */}
        <section className="inventory">
          <h2>🚨 Medicine Stock Alerts</h2>

          <p>Clinics requiring immediate medicine attention.</p>

          {lowStockClinics.length > 0 ? (
            <div>
              {lowStockClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  style={{
                    background: "#fff0f0",
                    borderLeft: "5px solid #e53935",
                    padding: "15px",
                    marginBottom: "12px",
                    borderRadius: "6px"
                  }}
                >
                  <h3 style={{ color: "#c62828" }}>
                    ⚠️ Low Stock Alert: {clinic.name}
                  </h3>

                  <p>Village: {clinic.village}</p>
                  <p>Medicine: {clinic.medicine}</p>

                  <p>
                    Available Stock: <strong>{clinic.stock} Packs</strong>
                  </p>

                  <strong style={{ color: "#c62828" }}>
                    Action Required: Medicine replenishment needed.
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#e8f5e9",
                padding: "15px",
                borderRadius: "6px",
                color: "#2e7d32"
              }}
            >
              <strong>✓ All clinics have sufficient stock.</strong>
              <p>No low-stock alerts at the moment.</p>
            </div>
          )}
        </section>

        {/* Medicine Shortage Prediction */}
        <section className="inventory">
          <h2>🔮 Medicine Shortage Predictions</h2>

          <p>
            Estimated medicine availability based on daily usage.
          </p>

          <table>
            <thead>
              <tr>
                <th>Clinic</th>
                <th>Current Stock</th>
                <th>Daily Usage</th>
                <th>Days Remaining</th>
                <th>Prediction</th>
              </tr>
            </thead>

            <tbody>
              {medicinePredictions.map((clinic) => (
                <tr key={clinic.id}>
                  <td>{clinic.name}</td>
                  <td>{clinic.stock} Packs</td>
                  <td>{clinic.dailyUsage} Packs</td>
                  <td>
                    {clinic.daysRemaining === null
                      ? "Unknown"
                      : `${clinic.daysRemaining} Days`}
                  </td>
                  <td>
                    <span
                      className={
                        clinic.daysRemaining !== null &&
                        clinic.daysRemaining <= 7
                          ? "low"
                          : "normal"
                      }
                    >
                      {clinic.prediction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Medicine Shortage Trend Chart */}
        <ShortageTrendChart clinics={clinics} />

        {/* Clinic Map */}
        <ClinicMap clinics={clinics} />

        {/* Transfer Recommendations */}
        <TransferRecommendations clinics={clinics} />

      </main>
    </div>
  );
}

export default App;
