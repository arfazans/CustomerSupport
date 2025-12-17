import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./login.jsx";
import Dashboard from "./Dashboard.jsx";
import GroupsFunctionality from "./GroupsFunctionality.jsx"
import Profile from "./Profile.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NoteState from "./ContextApi/Notestate.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path:"/groupsFunctionality",
    element:<ProtectedRoute><GroupsFunctionality/></ProtectedRoute>
  },
  {
    path:"/userProfile",
    element:<ProtectedRoute><Profile/></ProtectedRoute>
  }
]);

createRoot(document.getElementById("root")).render(

  <NoteState>
     <Toaster/>
    <RouterProvider router={router} />
  </NoteState>

);
