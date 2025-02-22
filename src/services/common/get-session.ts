import { Session, User } from "better-auth/types";

export async function getSession(headers: Headers) {
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/get-session`,
    {
      headers,
    }
  );

  const sessionJson = await sessionRes.json();
  if (!sessionJson) return null;

  const session: Session = sessionJson.session
  const user: User = sessionJson.user

  return {session, user}
}
