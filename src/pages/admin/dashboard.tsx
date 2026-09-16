import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Dashboard from "../../components/admin/dashboard";

const DashboardPage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Zang Global</title>
        <meta
          name="description"
          content="Admin dashboard for managing products, orders and customers"
        />
      </Helmet>
      <div className="flex">
            <Dashboard />
      </div>
    </>
  );
};

export default DashboardPage;
