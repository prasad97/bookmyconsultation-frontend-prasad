import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/logo.jpeg";
import Modal from "react-modal";
import { Button, Tabs, Tab } from "@material-ui/core";
import TabContainer from "../tabContainer/TabContainer";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";

Modal.setAppElement(document.getElementById("root"));

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Header = ({ baseUrl, isLogin, setIsLogin }) => {
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  const tabSwitchHandler = (event, value) => {
    setValue(value);
  };

  const logoutHandler = async () => {
    const url = baseUrl + "auth/logout";
    const params = sessionStorage.getItem("accessToken");

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${params}`,
        },
      });

      if (rawResponse.ok) {
        sessionStorage.removeItem("user-details");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("accessToken");
        setIsLogin(false);

        console.log("User Logged Out");
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        console.log("User Could not be logged out");
        throw error;
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const loginUser = async (email, password) => {
    const url = baseUrl + "auth/login";
    // console.log(url);
    const params = window.btoa(email + ":" + password);

    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Basic ${params}`,
        },
      });

      if (rawResponse.ok) {
        const response = await rawResponse.json();
        // console.log(response.accessToken);
        // window.location.href = "/";
        window.sessionStorage.setItem("user-details", JSON.stringify(response));
        window.sessionStorage.setItem("userId", JSON.stringify(response.id));
        window.sessionStorage.setItem("accessToken", response.accessToken);
        setIsLogin(true);
        toggleModalHandler();
        console.log("User Logged In");
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        console.log("User Could not be logged in");
        throw error;
      }
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    const isLoggedIn =
      sessionStorage.getItem("accessToken") == null ? false : true;
    setIsLogin(isLoggedIn);
  }, []);

  return (
    <div>
      <header className="header">
        <img src={logo} className="logo" alt="logo" /> Doctor Finder
        <div className="login-button">
          {!isLogin === true ? (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleModalHandler}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          )}
        </div>
      </header>
      <Modal
        ariaHideApp={false}
        isOpen={openModal}
        onRequestClose={toggleModalHandler}
        style={customStyles}
      >
        <Tabs value={value} onChange={tabSwitchHandler}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <TabContainer>
          {value === 0 && <Login baseUrl={baseUrl} loginUser={loginUser} />}
          {value === 1 && (
            <Register
              baseUrl={baseUrl}
              toggleModalHandler={toggleModalHandler}
              loginUser={loginUser}
            />
          )}
        </TabContainer>
      </Modal>
    </div>
  );
};

export default Header;
