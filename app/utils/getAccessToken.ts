import { supabase } from "@/supabaseClient";

export const getAccessToken = async () => {
  const session = await supabase.auth.getSession();
  const accessToken = session?.data.session?.provider_token; // Retrieve access token from session
  return accessToken;
};

export const getUserData = async () => {
  const session = await supabase.auth.getSession();
  const user = session?.data.session?.user; // Retrieve access token from session
  return user;
}