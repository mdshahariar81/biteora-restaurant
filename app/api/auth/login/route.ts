import { createHash } from "crypto";
import { NextResponse } from "next/server";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "WORKER";
  passwordHash: string;
  active: boolean;
  createdAt: string;
};

const DEMO_USERS = [
  {
    id: "demo-owner-001",
    name: "Restaurant Owner",
    email: "owner@biteora.com",
    password: "Biteora@123",
    role: "OWNER" as const,
  },
  {
    id: "demo-admin-001",
    name: "Restaurant Admin",
    email: "admin@biteora.com",
    password: "Biteora@123",
    role: "ADMIN" as const,
  },
  {
    id: "demo-worker-001",
    name: "Restaurant Worker",
    email: "worker@biteora.com",
    password: "Biteora@123",
    role: "WORKER" as const,
  },
];

/*
 * The Staff API uses the same global development store.
 *
 * Production:
 * This will be replaced by the real database/authentication
 * system provided by the backend.
 */
const globalStore = globalThis as typeof globalThis & {
  __biteoraStaffStore?: StaffUser[];
};

function verifyPassword(
  password: string,
  storedHash: string,
): boolean {
  const separatorIndex = storedHash.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const salt = storedHash.slice(0, separatorIndex);
  const originalHash = storedHash.slice(
    separatorIndex + 1,
  );

  const calculatedHash = createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");

  return calculatedHash === originalHash;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    /*
     * Basic validation.
     */
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        { status: 400 },
      );
    }

    /*
     * ------------------------------------------------
     * 1. Check built-in development accounts
     * ------------------------------------------------
     */
    const demoUser = DEMO_USERS.find(
      (user) =>
        user.email === email &&
        user.password === password,
    );

    if (demoUser) {
      const response = NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
        },
      });

      /*
       * Development session cookie.
       *
       * Production:
       * Use a secure server-side session/auth provider.
       */
      response.cookies.set({
        name: "biteora_session",
        value: "development-authenticated-session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      response.cookies.set({
        name: "biteora_role",
        value: demoUser.role,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    /*
     * ------------------------------------------------
     * 2. Check dynamically created staff accounts
     * ------------------------------------------------
     */
    const staffUser =
      globalStore.__biteoraStaffStore?.find(
        (user) =>
          user.email === email &&
          user.active,
      );

    if (staffUser) {
      const passwordValid = verifyPassword(
        password,
        staffUser.passwordHash,
      );

      if (!passwordValid) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unable to sign in. Please check your credentials.",
          },
          { status: 401 },
        );
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: staffUser.id,
          name: staffUser.name,
          email: staffUser.email,
          role: staffUser.role,
        },
      });

      /*
       * Store authenticated session.
       */
      response.cookies.set({
        name: "biteora_session",
        value: "development-authenticated-session",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      /*
       * Store role separately so the current development
       * proxy can enforce route access.
       */
      response.cookies.set({
        name: "biteora_role",
        value: staffUser.role,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    /*
     * ------------------------------------------------
     * Invalid credentials
     * ------------------------------------------------
     */
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to sign in. Please check your credentials.",
      },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
      },
      { status: 400 },
    );
  }
}