import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, User, Lock, Plus, X } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    shopNames: ["", "", "", ""],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const shopNames = formData.shopNames.filter((name) => name.trim() !== "");
    if (shopNames.length < 3) {
      setError("At least 3 shop names required");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        username: formData.username,
        password: formData.password,
        shopNames,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const addShopField = () => {
    if (formData.shopNames.length < 6) {
      setFormData({
        ...formData,
        shopNames: [...formData.shopNames, ""],
      });
    }
  };

  const removeShopField = (index) => {
    if (formData.shopNames.length > 4) {
      const newShops = formData.shopNames.filter((_, i) => i !== index);
      setFormData({ ...formData, shopNames: newShops });
    }
  };

  const filledShops = formData.shopNames.filter(
    (name) => name.trim() !== ""
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            {/* <Store className="w-8 h-8 text-white" />  */}
            <span className="text-white text-2xl" >9am</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join our platform and manage your shops
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* User Credentials Section */}
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Shop Names Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Shops
                  </h3>
                  <Badge
                    variant={filledShops >= 3 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {filledShops}/3+ required
                  </Badge>
                </div>

                <div className="space-y-3">
                  {formData.shopNames.map((shop, i) => (
                    <div key={i} className="relative group">
                      <div className="relative">
                        <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={`Shop Name ${i + 1}${
                            i < 3 ? " (required)" : " (optional)"
                          }`}
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          value={shop}
                          onChange={(e) => {
                            const newShops = [...formData.shopNames];
                            newShops[i] = e.target.value;
                            setFormData({ ...formData, shopNames: newShops });
                          }}
                          required={i < 3}
                        />
                        {i >= 4 && (
                          <button
                            type="button"
                            onClick={() => removeShopField(i)}
                            className="absolute right-3 top-3 h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3 mx-auto" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {formData.shopNames.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addShopField}
                    className="w-full border-dashed border-2 h-12 text-gray-600 hover:text-gray-900 hover:border-gray-400"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Shop
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
