import { supabase } from "./supabase";

// 🔐 Register user
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};

// Login user
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

// 🚪 Logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 👤 Get current user
export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};