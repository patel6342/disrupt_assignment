import React from "react";
import "./ComponentLoaderStyle.css";
import Lottie from "lottie-react";
import loader from "./loader.json";

const ComponentLoader = () => {
  return (
    <div className="center-body">
      <Lottie animationData={loader} loop={true} style={{ width: "60px" }} />
     
    </div>
  );
};

export default ComponentLoader;
