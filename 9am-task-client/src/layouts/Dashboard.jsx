import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Spinner from "@/components/Spinner";
import { LogOut } from "lucide-react";
import { Store } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";

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
    toast("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: async () => {
          toast.promise(
            axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`),
            {
              loading: "Signing Out...",
              success: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("shopNames");
                navigate("/login");
                return "Signed Out Successfully!";
              },
              error: (err) => err.message,
            }
          );
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Welcome, {userData?.username}
                </CardTitle>
                <CardDescription>Manage your account and shops</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowProfile(!showProfile)}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Profile
                {showProfile ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {showProfile && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Username
                  </p>
                  <p className="text-lg font-medium">{userData?.username}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Your Shops
                  </p>
                  {userData?.shopNames && userData.shopNames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {userData.shopNames.map((shop, index) => (
                        <Card
                          key={index}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <a
                              href={`http://${shop}.localhost:5173`}
                              className="flex items-center text-primary hover:underline"
                            >
                              <Store className="h-4 w-4 mr-2" />
                              <span className="font-medium">{shop}</span>
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No shops found
                      </p>
                      <Button variant="outline">
                        <Store className="h-4 w-4 mr-2" />
                        Create Your First Shop
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
