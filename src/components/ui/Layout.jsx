import React from "react";
import Navbar from "../navbar/Navbar";


const Layout = ({ children, showNavbar }) => {
  return (
    <section className="h-full flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex-grow flex flex-col">{children}</div>
    </section>
  );
};

export default Layout;
