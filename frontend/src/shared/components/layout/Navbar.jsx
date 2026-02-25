import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { NoteContext } from "../../../ContextApi/CreateContext";
import Logo from "../../../assets/LogoBG.png";
import styled from "styled-components";
import toast from "react-hot-toast"

function Navbar({ mobileView, setMobileView, currentPage = 'home' }) {
  const URL = "http://localhost:9860";
  const { socket, userId, setUserId } = useContext(NoteContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    if (setMobileView) {
      setMobileView(view);
    } else {
      // For non-dashboard pages, navigate to dashboard with the view
      if (view === 'posts') {
        navigate('/dashboard');
      } else if (view === 'messages') {
        navigate('/dashboard');
        // Use setTimeout to ensure navigation completes before setting view
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('setMobileView', { detail: 'messages' }));
        }, 100);
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (socket.current) {
      socket.current.emit("user-logout", userId);
      socket.current.disconnect();
    }
    try {
      const response = await axios.post(
        `${URL}/user/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Logout Successfully");
        setUserId(null);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      alert("Logout Failed, Please try again");
    }
  };

  return (
    <header className="sticky max-sm:mx-4 border-black border-1 shadow-[0px_8px_6px_-6px_white] top-4 inset-x-0 z-50 max-w-5xl w-full mx-auto rounded-4xl bg-[#FFF9F3]">
      <nav className="relative max-w-5xl w-full flex flex-wrap md:flex-nowrap items-center justify-between py-2 ps-5 pe-2 md:py-0">
        <div className="flex items-center">
          <FloatingLogo src={Logo} alt="ChatNation Logo" />
        </div>

        {/* Button Group */}
        <div className="md:order-3 flex items-center gap-x-3">
          <div className="md:ps-3">
            <button
              onClick={handleLogout}
              className="group cursor-pointer inline-flex items-center gap-x-2 py-2 px-3 bg-[#ff0] font-medium text-sm text-nowrap text-neutral-800 rounded-full focus:outline-hidden"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="size-9 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white"
              aria-label="Toggle navigation"
            >
              <svg
                className={`shrink-0 size-4 ${isMenuOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
              <svg
                className={`shrink-0 size-4 ${isMenuOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapse */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} overflow-hidden transition-all duration-300 basis-full grow md:block`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-y-3 py-2 md:py-0 md:ps-7">
            <a
              className={`pe-3 ps-px sm:px-3 md:py-4 text-sm hover:text-neutral-700 focus:outline-none focus:text-neutral-700 ${
                (currentPage === 'home' && mobileView === 'posts') || (currentPage === 'home' && !mobileView) ? 'text-blue-600 font-semibold' : 'text-black'
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('posts');
              }}
            >
              Home
            </a>
            <a
              className={`pe-3 ps-px sm:px-3 md:py-4 text-sm hover:text-neutral-700 focus:outline-none focus:text-neutral-700 md:hidden ${
                (currentPage === 'home' && mobileView === 'messages') ? 'text-blue-600 font-semibold' : 'text-black'
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('messages');
              }}
            >
              Messages
            </a>
            <a
              className="pe-3 ps-px sm:px-3 md:py-4 text-sm text-black hover:text-neutral-700 focus:outline-none focus:text-neutral-700"
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </a>
            <a
              className={`pe-3 ps-px sm:px-3 md:py-4 text-sm hover:text-neutral-700 focus:outline-none focus:text-neutral-700 ${
                currentPage === 'profile' ? 'text-blue-600 font-semibold' : 'text-black'
              }`}
              href="/userProfile"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </a>
            <a
              className={`pe-3 ps-px sm:px-3 md:py-4 text-sm hover:text-neutral-700 focus:outline-none focus:text-neutral-700 ${
                currentPage === 'groups' ? 'text-blue-600 font-semibold' : 'text-black'
              }`}
              href="/groupsFunctionality"
              onClick={() => setIsMenuOpen(false)}
            >
              Groups
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

const FloatingLogo = styled.img`
  height: 3rem;
  width: 18rem;
  object-fit: cover;
  margin-left:-2rem;
  animation: float-x 5.5s ease-in-out infinite;

  @keyframes float-x {
    0%   { transform: translateX(0); }
    50%  { transform: translateX(0.5rem); }
    100% { transform: translateX(0); }
  }
`;


export default Navbar;
