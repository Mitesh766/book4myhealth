import moment from "moment-timezone";

export function isDoctorAvailable(
  availability: Record<string, { start: string; end: string }>
) {

  const today = moment().tz("Asia/Kolkata").format("dddd").toLowerCase();
  
  const currentTime = moment().tz("Asia/Kolkata").format("HH:mm");

  const todayAvailability = availability[today];
  if (!todayAvailability) return false; // doctor not available today


  return currentTime >= todayAvailability.start &&
         currentTime <= todayAvailability.end;
}
