import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./login.jsx";
import Dashboard from "./Dashboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NoteState from "./ContextApi/Notestate.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
]);

createRoot(document.getElementById("root")).render(
  <NoteState>
    <RouterProvider router={router} />
  </NoteState>
);
