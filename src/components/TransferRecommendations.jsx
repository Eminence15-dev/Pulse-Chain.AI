
import { getTransferRecommendation } from "../utils/transferUtils";

function TransferRecommendations({ clinics }) {
  // Get recommendation using the latest clinic inventory
  const recommendation = getTransferRecommendation(clinics);

  if (!recommendation) {
    return (
      <section className="transfer-section">
        <h2>Smart Medicine Transfer Recommendations</h2>
        <p>No suitable transfer recommendation available.</p>
      </section>
    );
  }

  // Calculate stock after medicine transfer
  const recipientStockAfter =
    recommendation.recipient.stock +
    recommendation.transferAmount;

  const donorStockAfter =
    recommendation.donor.stock -
    recommendation.transferAmount;

  // Calculate how many days the new stock will last
  const newCoverageDays = Math.floor(
    recipientStockAfter /
    recommendation.recipient.dailyUsage
  );

  const oldCoverageDays = Math.floor(
    recommendation.recipient.stock /
    recommendation.recipient.dailyUsage
  );

  return (
    <section className="transfer-section">

      <h2>Smart Medicine Transfer Recommendations</h2>

      <p>
        Nearest donor selection based on predicted shortages
        and geographical distance.
      </p>

      <div className="transfer-card">

        <div className="transfer-header">
          <h3>{recommendation.donor.medicine}</h3>
          <span className="recommended">Recommended</span>
        </div>

        <div className="transfer-details">

          <div className="clinic-box">
            <h4>Donor Clinic</h4>
            <h2>{recommendation.donor.name}</h2>
            <p>Village: {recommendation.donor.village}</p>
            <p>Current Stock: {recommendation.donor.stock} Packs</p>
            <p>After Transfer: {donorStockAfter} Packs</p>
            <span className="surplus-label">Surplus</span>
          </div>

          <div className="transfer-arrow">
            <h2>→</h2>
            <strong>{recommendation.transferAmount} Packs</strong>
          </div>

          <div className="clinic-box">
            <h4>Recipient Clinic</h4>
            <h2>{recommendation.recipient.name}</h2>
            <p>Village: {recommendation.recipient.village}</p>
            <p>Current Stock: {recommendation.recipient.stock} Packs</p>
            <p>After Transfer: {recipientStockAfter} Packs</p>
            <span className="shortage-label">Shortage Predicted</span>
          </div>

        </div>

        <div className="transfer-footer">
          <h3>Transfer Details</h3>

          <p>
            Transfer {recommendation.transferAmount} packs
            from {recommendation.donor.name} to{" "}
            {recommendation.recipient.name}.
          </p>

          <p>
            Geographical Distance: {recommendation.distance} km
          </p>
        </div>

        {/* Smart Transfer Impact Summary */}
        <div
          className="impact-summary"
          style={{
            background: "#eaf7f0",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px"
          }}
        >
          <h3>Smart Transfer Impact Summary</h3>

          <p>
            <strong>Medicine Transferred:</strong>{" "}
            {recommendation.transferAmount} Packs
          </p>

          <p>
            <strong>Recipient Stock Before:</strong>{" "}
            {recommendation.recipient.stock} Packs
          </p>

          <p>
            <strong>Recipient Stock After:</strong>{" "}
            {recipientStockAfter} Packs
          </p>

          <p>
            <strong>Coverage Before Transfer:</strong>{" "}
            {oldCoverageDays} Days
          </p>

          <p>
            <strong>Coverage After Transfer:</strong>{" "}
            {newCoverageDays} Days
          </p>

          <p>
            <strong>Additional Coverage:</strong>{" "}
            {newCoverageDays - oldCoverageDays} Days
          </p>

          <h4>
            Medicine shortage risk reduced through smart
            resource redistribution.
          </h4>
        </div>

      </div>
    </section>
  );
}

export default TransferRecommendations;
