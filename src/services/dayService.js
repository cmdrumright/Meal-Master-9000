export const getDays = () => {
  return fetch(`http://localhost:8088/days`).then((res) => res.json())
}

export const getTimeSlots = () => {
  return fetch(`http://localhost:8088/timeslots`).then((res) => res.json())
}
