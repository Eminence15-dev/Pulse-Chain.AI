
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";

function InventoryChart({ clinics }) {

  // Prepare live clinic data for the chart
  const chartData = clinics.map((clinic) => ({
    name: clinic.name,
    stock: clinic.stock,
    status: clinic.status
  }));

  // Assign colors according to stock status
  const getBarColor = (status) => {
    if (status === "low") return "#e53935";
    if (status === "surplus") return "#16a36a";
    return "#2878d0";
  };

  return (
    <section className="inventory-chart-section">

      <h2>Medicine Inventory Analytics</h2>

      <p>
        Visual comparison of medicine stock across all clinics.
      </p>

      <div style={{ width: "100%", height: 350 }}>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis
              label={{
                value: "Medicine Packs",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="stock"
              name="Available Medicine"
              radius={[6, 6, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.status)}
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="map-legend">
        <span>🔴 Low Stock</span>
        <span>🟢 Surplus</span>
        <span>🔵 Normal Stock</span>
      </div>

    </section>
  );
}

export default InventoryChart;
