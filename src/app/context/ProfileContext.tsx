import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ProfileService, UserProfile } from "../services/ProfileService";
import { toast } from "sonner";

interface ProfileContextType {
  profile: UserProfile | null;
  loadingProfile: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loadingProfile: true,
  updateProfile: async () => false,
  refreshProfile: async () => {},
});

export const useUserProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    try {
      const data = await ProfileService.getUserProfile(user.uid);
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return false;
    try {
      await ProfileService.updateUserProfile(user.uid, data);
      await fetchProfile(); // Refresh context profile data immediately
      toast.success("Profile Updated Successfully");
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Update Failed");
      return false;
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loadingProfile, updateProfile, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
