import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/* zdroje: https://medium.com/@turingvang/how-to-use-matcher-in-next-js-middleware-cf18f441d52a, https://nextjs.org/docs/app/api-reference/file-conventions/middleware, https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token.role !== "teacher") {
    if (
      pathname.startsWith("/dashboard/add-board") ||
      pathname.endsWith("/edit-section") ||
      pathname.endsWith("/add") ||
      pathname.endsWith("/add/text") ||
      pathname.endsWith("/add/photo") ||
      pathname.endsWith("/add/file") ||
      pathname.endsWith("/add/pdf") ||
      pathname.endsWith("/add/video") ||
      pathname.endsWith("/add/audio") ||
      pathname.startsWith("/dashboard/archive") ||
      pathname.startsWith("/dashboard/add-board") ||
      pathname.startsWith("/dashboard/conversations/add-conversation") ||
      pathname.startsWith("/dashboard/polls/add-poll") ||
      pathname.startsWith("/dashboard/administration")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
}

export const config = { matcher: ["/dashboard(.*)"] };
