import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "./Profile.css";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    classLevel: "",
  });
  const [preview, setPreview] = useState("");

  const { auth } = useAuth();
  const token = auth.token;
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "https://edu-master-delta.vercel.app/user",
        {
          headers: { token },
        }
      );
      const data = response.data.data;
      setUser(data);
      setFormData({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        classLevel: data.classLevel,
      });

      const localImage = localStorage.getItem("profileImage");
      if (localImage) {
        setPreview(localImage);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      localStorage.setItem("profileImage", previewURL);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        classLevel: formData.classLevel,
      };

      await axios.put(
        `https://edu-master-delta.vercel.app/user/${user._id}`,
        payload,
        { headers: { token } }
      );

      await fetchUserData();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 p-4">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster richColors />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isEditing ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl !text-white">
                  Edit Profile
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Avatar Centered */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                      <AvatarImage
                        src={
                          preview ||
                          `https://api.dicebear.com/6.x/initials/svg?seed=${formData.fullName}`
                        }
                      />
                      <AvatarFallback>
                        {formData.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <Label
                      htmlFor="profileImage"
                      className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Label>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["fullName", "email", "phoneNumber", "classLevel"].map(
                    (field) => (
                      <div key={field} className="space-y-1">
                        <Label className="capitalize text-sm sm:text-base">
                          {field.replace(/([A-Z])/g, " $1")}
                        </Label>
                        <input
                          name={field}
                          value={formData[field]}
                          onChange={handleInputChange}
                          type={
                            field === "email"
                              ? "email"
                              : field === "phoneNumber"
                              ? "tel"
                              : "text"
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                        />
                      </div>
                    )
                  )}
                </div>
              </CardContent>

              {/* Footer Buttons */}
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 p-4 sm:p-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-red-100 border-red-300 border-2 text-red-500 w-full sm:w-auto hover:bg-red-200"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-slate-800 hover:bg-slate-600 w-full sm:w-auto"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card className="w-full max-w-4xl mx-auto shadow-sm sm:shadow-md rounded-lg sm:rounded-xl border border-gray-100 sm:border-none bg-white p-4 sm:p-6 md:p-8">
            <CardHeader className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                <AvatarImage
                  src={
                    preview ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${user.fullName}`
                  }
                  alt="User"
                />
                <AvatarFallback>
                  {user.fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
                  {user.fullName}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-500 mt-1">
                  {user.classLevel} •{" "}
                  {user.role === "user"
                    ? "Student"
                    : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
              <div className="space-y-1">
                <span className="font-semibold text-gray-600">Email:</span>
                <p className="text-gray-700 break-all">{user.email}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-600">
                  Phone Number:
                </span>
                <p className="text-gray-700">{user.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-600">Verified:</span>
                <p
                  className={`${
                    user.isVerified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.isVerified ? "Yes ✅" : "No ❌"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-600">Created At:</span>
                <p className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end p-4 sm:p-6">
              <Button
                className="bg-slate-800 hover:bg-slate-600 w-full sm:w-auto"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
