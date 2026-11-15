
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function ShortageTrendChart({ clinics }) {

  // Generate estimated stock levels for the next 7 days
  const chartData = Array.from(
    { length: 8 },
    (_, day) => {
      const data = { day: `Day ${day}` };

      clinics.forEach((clinic) => {
        data[clinic.name] = Math.max(
          0,
          clinic.stock - clinic.dailyUsage * day
        );
      });

      return data;
    }
  );

  const colors = [
    "#2878d0",
    "#16a36a",
    "#e53935",
    "#8e44ad",
    "#f39c12"
  ];

  return (
    <section className="inventory">

      <h2>📉 Medicine Shortage Trend Analysis</h2>

      <p>
        Estimated medicine stock levels over the next 7 days
        based on current daily usage.
      </p>

      <div style={{ width: "100%", height: 350 }}>

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis
              label={{
                value: "Medicine Packs",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip />

            <Legend />

            {clinics.map((clinic, index) => (
              <Line
                key={clinic.id}
                type="monotone"
                dataKey={clinic.name}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}

          </LineChart>

        </ResponsiveContainer>

      </div>

      <p style={{ fontSize: "13px", color: "#777" }}>
        Note: This is a rule-based projection assuming daily usage
        remains constant. It is not a trained machine learning forecast.
      </p>

    </section>
  );
}

export default ShortageTrendChart;
