"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase/client";
import { getUserProfile } from "@/services/auth-service";
import { getRestaurantById } from "@/services/restaurant-service";
import { Restaurant, UserProfile } from "@/types";

interface AuthContextValue {
  loading: boolean;
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  restaurant: Restaurant | null;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const loadSession = useCallback(async (uid: string) => {
    try {
      const profile = await getUserProfile(uid);

      if (!profile) {
        setUserProfile(null);
        setRestaurant(null);
        return;
      }

      setUserProfile(profile);

      const targetRestaurantId = profile.restaurantId || uid;

      try {
        const restaurantData = await getRestaurantById(targetRestaurantId);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("[Auth] Restaurant session data could not be loaded:", error);
        setRestaurant(null);
      }
    } catch (error) {
      console.error("[Auth] User profile could not be loaded:", error);
      setUserProfile(null);
      setRestaurant(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!firebaseAuth.currentUser) {
      setUserProfile(null);
      setRestaurant(null);
      return;
    }

    await loadSession(firebaseAuth.currentUser.uid);
  }, [loadSession]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setUserProfile(null);
        setRestaurant(null);
        setLoading(false);
        return;
      }

      try {
        await loadSession(user.uid);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loadSession]);

  const value = useMemo(
    () => ({
      loading,
      firebaseUser,
      userProfile,
      restaurant,
      refreshSession,
    }),
    [loading, firebaseUser, userProfile, restaurant, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth AuthProvider içinde kullanılmalı.");
  }

  return context;
}
