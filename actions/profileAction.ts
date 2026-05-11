"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  
  if (!password || password.length < 6) {
    return { error: "Kata sandi baru minimal 6 karakter." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;
  if (!sessionCookie) return { error: "Sesi tidak valid." };

  const user = JSON.parse(sessionCookie);

  const { error } = await supabase
    .from("pengguna")
    .update({ password }) // Ingat: Di produksi gunakan hashing!
    .eq("id", user.id);

  if (error) {
    return { error: "Gagal merubah kata sandi: " + error.message };
  }

  return { success: true };
}