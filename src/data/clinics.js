
const clinicData = [
  {
    id: 1,
    name: "Clinic A",
    village: "Village A",
    lat: 31.4504,
    lng: 73.1350,
    medicine: "Malaria Medicine",
    stock: 30,
    dailyUsage: 5
  },
  {
    id: 2,
    name: "Clinic B",
    village: "Village B",
    lat: 31.4600,
    lng: 73.1200,
    medicine: "Malaria Medicine",
    stock: 100,
    dailyUsage: 8
  },
  {
    id: 3,
    name: "Clinic C",
    village: "Village C",
    lat: 31.4400,
    lng: 73.1500,
    medicine: "Malaria Medicine",
    stock: 50,
    dailyUsage: 5
  }
];

// Automatically calculate clinic status
export const clinics = clinicData.map((clinic) => {
  let status;

  if (clinic.stock <= 20) {
    status = "low";
  } else if (clinic.stock >= 80) {
    status = "surplus";
  } else {
    status = "normal";
  }

  return {
    ...clinic,
    status
  };
});
