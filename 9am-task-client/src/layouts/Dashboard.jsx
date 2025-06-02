import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
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

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      toast.promise(
        axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`),
        {
          loading: "Signing Out...",
          success: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("shopNames");
            navigate("/login");
            return <b>Signed Out Successfully!</b>;
          },
          error: (err) => err.message,
        }
      );
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => setShowProfile(true)}>
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{userData?.username}'s Profile</DialogTitle>
            </DialogHeader>
            <ul className="space-y-2">
              {userData?.shopNames.map((shop, index) => (
                <li key={index}>
                  <a
                    href={`http://${shop}.localhost:5173`}
                    className="text-blue-500 hover:underline"
                  >
                    {shop}
                  </a>
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </div>
  );
};

export default Dashboard;
