import React, { useState, useContext } from "react";
import styled from "styled-components";
import loginImage from "./assets/loginimage.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NoteContext } from "./ContextApi/CreateContext";

function Login() {
  const URL = "http://localhost:9860";
  const { setUserId } = useContext(NoteContext);
  const [checked, setchecked] = useState(false);
  const [loginData, setloginData] = useState({ email: "", password: "" });
  const [signUpData, setsignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const signupsubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.post(`${URL}/user/signup`, signUpData, {
        withCredentials: true,
      });
      console.log(result);
      if (result.status === 200) {

        setUserId(result.data.userId);

        alert("SignUp Successful");

        setsignUpData({ name: "", email: "", password: "" }); // Reset all fields
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("SignUp Failed");
    }
  };

  const loginsubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.post(`${URL}/user/login`, loginData, {
        withCredentials: true,
      });

      if (result.status === 200) {


        setUserId(result.data.userId);

        alert("login Successful");
        setloginData({ email: "", password: "" }); // Reset all fields

        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <LoginWrapper>
          <StyledWrapper>
            <div className="wrapper">
              <div className="toggle-row">
                <span className={`toggle-label ${!checked && "active"}`}>
                  Log in
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={checked}
                    onChange={() => setchecked(!checked)}
                  />
                  <span className="slider" />
                </label>
                <span className={`toggle-label ${checked && "active"}`}>
                  Sign up
                </span>
              </div>
              <div className={`flip-card__inner${checked ? " flipped" : ""}`}>
                <div className="flip-card__front">
                  <div className="title">Log in</div>
                  <form onSubmit={loginsubmit} className="flip-card__form">
                    <input
                      className="flip-card__input"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={loginData.email}
                      required={true}
                      onChange={(e) =>
                        setloginData({
                          ...loginData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      className="flip-card__input"
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={loginData.password}
                      required={true}
                      onChange={(e) =>
                        setloginData({
                          ...loginData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <button type="submit" className="flip-card__btn">
                      Let`s go!
                    </button>
                  </form>
                </div>
                <div className="flip-card__back">
                  <div className="title">Sign up</div>
                  <form onSubmit={signupsubmit} className="flip-card__form">
                    <input
                      className="flip-card__input"
                      placeholder="Name"
                      type="text"
                      name="name"
                      value={signUpData.name}
                      required={true}
                      onChange={(e) =>
                        setsignUpData({
                          ...signUpData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      className="flip-card__input"
                      name="email"
                      placeholder="Email"
                      type="email"
                      required={true}
                      value={signUpData.email}
                      onChange={(e) =>
                        setsignUpData({
                          ...signUpData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <input
                      className="flip-card__input"
                      name="password"
                      placeholder="Password"
                      type="password"
                      required={true}
                      value={signUpData.password}
                      onChange={(e) =>
                        setsignUpData({
                          ...signUpData,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <button type="submit" className="flip-card__btn">
                      Confirm!
                    </button>
                  </form>
                </div>
              </div>
              ;
            </div>
          </StyledWrapper>
        </LoginWrapper>
        <ImageWrapper>
          <img src={loginImage} alt="Login visual" />
        </ImageWrapper>
      </InnerContainer>
    </OuterContainer>
  );
}

const StyledWrapper = styled.div`
  width: 420px; /* or any desired px/em/rem/% value */
  max-width: 94vw; /* for responsiveness on small screens */
  margin: 0 auto; /* center horizontally */
  .wrapper {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .card-switch {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }
  .switch {
    display: flex;
    align-items: center;
  }
  .card-side {
    position: relative;
    display: flex;
    align-items: center;
    width: 120px;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
  }
  .card-side::before {
    content: "Log in";
    text-decoration: underline;
    margin-right: 14px;
    opacity: 1;
    transition: text-decoration 0.2s;
  }
  .card-side::after {
    content: "Sign up";
    text-decoration: none;
    margin-left: 14px;
    opacity: 0.8;
    transition: text-decoration 0.2s;
  }
  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 18px;
    gap: 20px;
  }

  .toggle-label.active {
    opacity: 1;
    text-decoration: underline;
  }
  .slider {
    width: 45px;
    height: 22px;
    border-radius: 12px;
    border: 2px solid var(--main-color);
    background: var(--bg-color);
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 2px 2px var(--main-color);
    display: inline-block;
  }
  .slider:before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 1px;
    border-radius: 10px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 0 2px 0 var(--main-color);
    transition: transform 0.3s;
  }
  .toggle:checked + .slider {
    background: var(--input-focus);
  }
  .toggle:checked + .slider:before {
    transform: translateX(23px);
  }
  .toggle:checked ~ .card-side::before {
    text-decoration: none;
    opacity: 0.8;
  }
  .toggle:checked ~ .card-side::after {
    text-decoration: underline;
    opacity: 1;
  }
  .toggle:checked ~ .flip-card__inner {
    transform: rotateY(180deg);
  }
  .flip-card__inner {
    width: 100%;
    max-width: 260px;
    min-width: 210px;
    height: 320px;
    position: relative;
    background-color: transparent;
    perspective: 800px;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    margin: 0 auto;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }
  .flip-card__inner.flipped {
    transform: rotateY(180deg);
  }
  .flip-card__outer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .flip-card__front {
    pointer-events: auto; /* Enable pointer events on front */
    backface-visibility: hidden;
  }

  .flip-card__back {
    pointer-events: none; /* Disable pointer events when not flipped */
    backface-visibility: hidden;
  }
  .flip-card__inner.flipped .flip-card__front {
    pointer-events: none; /* Disable front when flipped */
  }

  .flip-card__inner.flipped .flip-card__back {
    pointer-events: auto; /* Enable back when flipped */
  }

  .flip-card__front,
  .flip-card__back {
    padding: 12px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 2px solid var(--main-color);
    box-shadow: 3px 3px var(--main-color);
    background: #e5e5e5;
    left: 0;
    top: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .flip-card__back {
    transform: rotateY(180deg);
  }
  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 13px;
    width: 100%;
  }
  .title {
    font-size: 22px;
    font-weight: 900;
    color: var(--main-color);
    margin: 10px 0 16px 0;
  }
  .flip-card__input {
    width: 98%;
    max-width: 220px;
    min-width: 145px;
    height: 36px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 2px 2px var(--main-color);
    font-size: 14px;
    font-weight: 600;
    color: var(--font-color);
    padding: 2px 10px;
    outline: none;
    margin: 0;
  }
  .flip-card__input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }
  .flip-card__input:focus {
    border: 2px solid var(--input-focus);
  }
  .flip-card__btn {
    margin: 10px 0 0 0;
    width: 105px;
    height: 36px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background: var(--bg-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--main-color);
    box-shadow: 2px 2px var(--main-color);
    cursor: pointer;
    transition: box-shadow 0.1s, transform 0.1s;
  }
  .flip-card__btn:active {
    box-shadow: 0 0 var(--main-color);
    transform: translate(2px, 2px);
  }
  /* Responsive */
  @media (max-width: 480px) {
    .flip-card__inner {
      max-width: 96vw;
      min-width: 0;
      height: 260px;
    }
    .flip-card__front,
    .flip-card__back {
      padding: 8px;
      gap: 10px;
    }
    .title {
      font-size: 16px;
    }
    .flip-card__input {
      max-width: 98vw;
      font-size: 13px;
      height: 30px;
    }
    .flip-card__btn {
      width: 76px;
      font-size: 13px;
      height: 27px;
    }
  }
`;

const OuterContainer = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top right, #e2e2e2, #8e8e8e);
  padding: 2rem;
  box-sizing: border-box;
`;
const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  width: 100%;
  max-width: 1200px;

  height: 100%;
  max-height: calc(100vh - 4rem); /* leave padding space from OuterContainer */
  box-sizing: border-box;

  /* Let children shrink to prevent overflow */
  & > div {
    flex-shrink: 1;
    overflow: hidden;
  }

  /* Tailwind gradient equivalent, to top right from neutral-200 to neutral-600 */
  background: linear-gradient(
    to top right,
    #e5e5e5,
    /* roughly gray-200 */ #4a4a4a /* roughly gray-600 */
  );
`;
const LoginWrapper = styled.div`
  flex: 1 1 45%; /* allow shrinking but try to remain 45% width */
  min-width: 300px; /* minimal width */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const ImageWrapper = styled.div`
  flex: 1 1 55%; /* allow shrinking but try to remain 55% width */
  min-width: 400px;
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    max-width: 100%;
    max-height: 480px;
    object-fit: contain;
    border-radius: 12px;
  }
`;

export default Login;
