import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ShopDashboard = () => {
  const { shopName } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        // eslint-disable-next-line no-unused-vars
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const shopNames = JSON.parse(localStorage.getItem("shopNames") || "[]");
        if (!shopNames.includes(shopName)) {
          navigate("/dashboard");
        }
      } catch (err) {
        toast.error(err.message);
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [shopName, navigate]);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <CardHeader>
        <CardTitle>{shopName} Shop</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is {shopName} shop</p>
      </CardContent>
    </div>
  );
};

export default ShopDashboard;
