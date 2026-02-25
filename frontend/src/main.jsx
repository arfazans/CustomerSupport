import { createRoot } from "react-dom/client";
import "./index.css";
import { LoginPage, ProfilePage, AuthProtectedRoute } from "./features/auth";
import { Dashboard } from "./features/dashboard";
import { GroupsManagementPage } from "./features/groups";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NoteState from "./ContextApi/Notestate.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <AuthProtectedRoute><Dashboard /></AuthProtectedRoute>,
  },
  {
    path:"/groupsFunctionality",
    element:<AuthProtectedRoute><GroupsManagementPage/></AuthProtectedRoute>
  },
  {
    path:"/userProfile",
    element:<AuthProtectedRoute><ProfilePage/></AuthProtectedRoute>
  }
]);

createRoot(document.getElementById("root")).render(

  <NoteState>
     <Toaster/>
    <RouterProvider router={router} />
  </NoteState>

);
