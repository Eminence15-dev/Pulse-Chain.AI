
// Calculate geographical distance between two clinics
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const earthRadius = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// Find the nearest suitable donor clinic
export function getTransferRecommendation(clinics) {
  const donorReserve = 50;
  const recipientTarget = 60;

  // Find clinics predicted to run out within 7 days
  const recipients = clinics
    .filter(
      (clinic) =>
        clinic.dailyUsage > 0 &&
        Math.floor(clinic.stock / clinic.dailyUsage) <= 7
    )
    .sort(
      (a, b) =>
        a.stock / a.dailyUsage -
        b.stock / b.dailyUsage
    );

  // Find clinics with surplus medicine
  const donors = clinics.filter(
    (clinic) =>
      clinic.status === "surplus" &&
      clinic.stock > donorReserve
  );

  // Check recipients by urgency
  for (const recipient of recipients) {
    // Only consider donors with the same medicine
    const suitableDonors = donors
      .filter(
        (donor) => donor.medicine === recipient.medicine
      )
      .map((donor) => ({
        ...donor,
        distance: calculateDistance(
          donor.lat,
          donor.lng,
          recipient.lat,
          recipient.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    if (suitableDonors.length === 0) {
      continue;
    }

    const donor = suitableDonors[0];

    const transferAmount = Math.max(
      0,
      Math.min(
        donor.stock - donorReserve,
        recipientTarget - recipient.stock
      )
    );

    if (transferAmount > 0) {
      return {
        donor,
        recipient,
        transferAmount,
        distance: Number(donor.distance.toFixed(2))
      };
    }
  }

  return null;
}
