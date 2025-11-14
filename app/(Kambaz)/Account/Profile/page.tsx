"use client";
import * as client from "../client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [profile, setProfile] = useState<any>({
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    role: "USER",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }

    setProfile({
      _id: currentUser._id || "",
      username: currentUser.username || "",
      password: currentUser.password || "",
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      dob: currentUser.dob || "",
      email: currentUser.email || "",
      role: currentUser.role || "USER",
    });
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const updateProfile = async () => {
    try {
      if (!profile._id) {
        console.error("No user ID available");
        return;
      }
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  // Format date for the date input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    // Handle the date format from your database
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    return dateString;
  };

  // Don't render if no currentUser
  if (!currentUser) {
    return <div>Please sign in first</div>;
  }

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      <div>
        <FormControl
          id="wd-username"
          className="mb-2"
          value={profile.username}
          placeholder="username"
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
        <FormControl
          id="wd-password"
          className="mb-2"
          value={profile.password}
          placeholder="password"
          type="password"
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />
        <FormControl
          id="wd-firstname"
          className="mb-2"
          value={profile.firstName}
          placeholder="first name"
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
        />
        <FormControl
          id="wd-lastname"
          className="mb-2"
          value={profile.lastName}
          placeholder="last name"
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />
        <FormControl
          id="wd-dob"
          className="mb-2"
          type="date"
          value={formatDateForInput(profile.dob)}
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
        />
        <FormControl
          id="wd-email"
          className="mb-2"
          value={profile.email}
          placeholder="email"
          type="email"
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <select
          className="form-control mb-2"
          id="wd-role"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
          <option value="TA">TA</option>
        </select>
        <Button onClick={updateProfile} className="btn btn-primary w-100 mb-2">
          Update
        </Button>
        <Button onClick={signout} className="btn btn-danger w-100">
          Sign out
        </Button>
      </div>
    </div>
  );
}
