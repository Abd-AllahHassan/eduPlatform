import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // ✅ get token from context

export default function EditProfile() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    classLevel: "",
  });

  const { auth } = useAuth(); // ✅ access auth context
  const token = auth.token;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-delta.vercel.app/user",
          {
            headers: {
              token,
            },
          }
        );
        setProfile(response.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input
              className="border-2 py-3 mt-2 border-gray-200 placeholder:text-gray-400"
              placeholder="Full Name"
              value={profile.fullName || ""}
              readOnly
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              className="border-2 py-3 mt-2 border-gray-200 placeholder:text-gray-400"
              type="email"
              placeholder="Email"
              value={profile.email || ""}
              readOnly
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              className="border-2 py-3 mt-2 border-gray-200 placeholder:text-gray-400"
              type="tel"
              placeholder="Phone"
              value={profile.phoneNumber || ""}
              readOnly
            />
          </div>
          <div>
            <Label>Class Level</Label>
            <Input
              className="border-2 py-3 mt-2 border-gray-200 placeholder:text-gray-400"
              placeholder="Class"
              value={profile.classLevel || ""}
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-right">
        <Button className="px-6 bg-blue-950 text-white mt-2 hover:bg-blue-900">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
