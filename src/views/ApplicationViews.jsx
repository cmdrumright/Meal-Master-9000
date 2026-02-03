import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { TopBar } from "../components/nav/TopBar";

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const localLearningUser = localStorage.getItem("meal-master_user");
    const learningUserObject = JSON.parse(localLearningUser);
    setCurrentUser(learningUserObject);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <TopBar currentUser={currentUser} />
            <Outlet />
          </>
        }
      >
        <Route index element={<>Welcome</>} />
      </Route>
    </Routes>
  );
};
