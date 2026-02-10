export const getDays = () => {
  return fetch(`http://localhost:8088/days`).then((res) => res.json())
}
