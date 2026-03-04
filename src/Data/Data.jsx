export const Data = [
  {
    id: "D-5001",
    name: "John Doe",
    phone: "+1 555-0202",
    vehicle: "Sedan (TN-01-1234)",
    rating: "4.8/5",
    status: "Active",
  },
  {
    id: "D-5002",
    name: "David Smith",
    phone: "+1 555-0221",
    vehicle: "SUV (TN-01-5678)",
    rating: "4.5/5",
    status: "On Trip",
  },
  {
    id: "D-5003",
    name: "Chris Smith",
    phone: "+1 555-0231",
    vehicle: "Van (TN-01-9012)",
    rating: "4.9/5",
    status: "Active",
  },
  {
    id: "D-5003",
    name: "Berry Rothan",
    phone: "+1 555-0231",
    vehicle: "Sedan (TN-01-3456)",
    rating: "4.0/5",
    status: "Inactive",
  },
  {
    id: "D-5004",
    name: "Grent Allana",
    phone: "+1 555-0251",
    vehicle: "Sedan (TN-01-3456)",
    rating: "4.0/5",
    status: "Active",
  },
  {
    id: "D-5005",
    name: "Berry Roman",
    phone: "+1 555-0251",
    vehicle: "Sedan (TN-01-3456)",
    rating: "4.0/5",
    status: "Inactive",
  },
];


export const recentTripActivityData = [
  {
    tripId: "1290000",
    user: "Admini- John",
    destination: "Pencagon",
    date: "03/05/2023",
    status: "Completed",
  },
  {
    tripId: "1290001",
    user: "Mimel Stmith",
    destination: "Baot Francisco",
    date: "03/05/2023",
    status: "Approvals",
  },
  {
    tripId: "1290002",
    user: "Virian BrMark",
    destination: "Ponko",
    date: "06/06/2023",
    status: "Completed",
  },
  {
    tripId: "1290003",
    user: "Kenin Stmath",
    destination: "Pencagon",
    date: "08/02/2023",
    status: "Completed",
  },
];

export const revenueData = [
  { day: 'Mon', revenue: 2400 },
  { day: 'Tue', revenue: 1500 },
  { day: 'Wed', revenue: 9800 },
  { day: 'Thu', revenue: 3900 },
  { day: 'Fri', revenue: 4800 },
  { day: 'Sat', revenue: 3800 },
  { day: 'Sun', revenue: 4300 },
];

export const car = [
{
    id: "status-1",
    label: "Available",
    description: "Vehicles ready for dispatch"
  },
  {
    id: "status-2",
    label: "On Trip",
    description: "Vehicles currently with passengers"
  },
  {
    id: "status-3",
    label: "Maintenance",
    description: "Vehicles in the shop for repairs"
  },
  {
    id: "status-4",
    label: "Out of Service",
    description: "Vehicles retired or unavailable"
  }
];

const avaliable = car.filter(value=>(value.label.toLocaleLowerCase().trim() === "available"))
const onTrip = car.filter(value=>(value.label.toLocaleLowerCase().trim() === "on trip"))
const Maintenance = car.filter(value=>(value.label.toLocaleLowerCase().trim() === "maintenance"))
const outOfService = car.filter(value=>(value.label.toLocaleLowerCase().trim() === "out of service"))

export const fleetData = [
  { label: "Available", count: avaliable.length, total: 60, color: "#10b981" }, 
  { label: "On Trip", count: onTrip.length, total: 60, color: "#3b82f6" },   
  { label: "Maintenance", count: Maintenance.length, total: 60, color: "#f59e0b" }, 
  { label: "Out of Service", count: outOfService.length, total: 60, color: "#ef4444" } 
];