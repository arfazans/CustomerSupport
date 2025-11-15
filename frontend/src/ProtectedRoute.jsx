import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const URL = "http://localhost:9860";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${URL}/user/check-auth`, { withCredentials: true });
        if (res.status === 200) {
          setIsAuthorized(true);
        } else {
          alert("Unauthorized Access");
          setIsAuthorized(false);
        }
      } catch {
        alert("Unauthorized Access");
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;







  //  {users.map((user, index) => (
  //             <div
  //               key={index}
  //               onClick={() => handleUserSelect(user._id)}
  //               className={`relative border-b-2 border-transparent pr-4 cursor-pointer p-2 m-2 rounded-lg transition-all duration-300 ease-in-out flex items-center
  //   ${
  //     selectedUserId === user._id
  //       ? "bg-neutral-500 shadow-md shadow-gray-400/50 border-gray-300"
  //       : "bg-neutral-700 hover:border-black hover:pr-0 hover:m-0 hover:shadow-lg hover:shadow-gray-500/50"
  //   }`}
  //             >
  //               {/* Profile Image */}
  //               <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 mr-2">
  //                 <img
  //                   src={aman} // Replace with user.profilePic if available
  //                   alt="User Avatar"
  //                   className="w-full h-full object-cover"
  //                 />
  //               </div>

  //               {/* Text Container: flex-1 to fill remaining width */}
  //               <div className="flex-1 flex flex-col justify-center h-10">
  //                 {/* Name and Online Tag in same row */}
  //                 <div className="flex items-center justify-start space-x-2">
  //                   <h1 className="text-white fo  nt-semibold text-base truncate">
  //                     {user.name}
  //                   </h1>
  //                   {onlineUsers.includes(String(user._id)) && (
  //                     <span className="text-green-400 text-xs font-semibold">
  //                       online
  //                     </span>
  //                   )}
  //                 </div>
  //                 {/* Last message on next line */}
  //                 <p className="text-gray-300 text-xs truncate leading-tight">
  //                   {recentMessages[user._id] || "No messages yet"}
  //                   {console.log(recentMessages[user._id])}
  //                 </p>
  //               </div>
  //             </div>
  //           ))}
