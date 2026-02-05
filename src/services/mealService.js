export const getMyMeals = (userId) => {
  return fetch(`http://localhost:8088/meals?userId=${userId}`).then((res) =>
    res.json(),
  );
};
