import React from "react";
import axios from "axios";

import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Spinner from "@/components/Spinner";
import { Navigate } from "react-router";
const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.log(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <Spinner />;
  }
  if (!loading && !userData) {
    return navigate("/login");
  }
  return <Navigate to={"/dashboard"} />;
};

export default Home;
