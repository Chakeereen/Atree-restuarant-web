"use server";

import { cookies } from "next/headers";

export async function destroyCookie() {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", "", {
    expires: new Date(0), // หมดอายุทันที
    path: "/",             // ให้ตรงกับตอน set cookie
  });
}
