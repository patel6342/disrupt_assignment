import React from "react";

const ProgressBar = ({ progress, height = "20px", color = "#4caf50", backgroundColor = "#708BF72B" }) => {
  const containerStyles = {
    height: height,
    width: '100%',
    backgroundColor: backgroundColor,
    borderRadius: '50px',
    overflow: 'hidden',
  };

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: color,
    transition: 'width 0.5s ease-in-out',
  };

  const labelStyles = {
    padding: '5px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        {/* <span style={labelStyles}>{`${progress}%`}</span> */}
      </div>
    </div>
  );
};

export default ProgressBar;
