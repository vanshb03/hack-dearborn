import { createSupaBaseClient } from "@/app/utils/createSupaBaseClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const POST = async () => {
  const origin = headers().get('origin');
  const supabase = createSupaBaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}`,  // Adjust redirect URL as needed
      scopes: 'https://www.googleapis.com/auth/calendar'
    },
  });

  if (error) {
    console.error('Google Sign-In Error:', error);
    return new Response('Authentication Failed', { status: 500 });
  }

  return redirect(`${data.url}`);
};