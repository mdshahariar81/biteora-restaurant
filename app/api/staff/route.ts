import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

/*
 * Biteora Development Staff Store
 *
 * IMPORTANT:
 * This is temporary development storage.
 *
 * Production:
 * - Staff must be stored in the backend database.
 * - Passwords must be securely hashed.
 * - Sessions must be server-side.
 * - Owner permissions must be verified by the backend.
 */

type StaffRole = "OWNER" | "ADMIN" | "WORKER";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

/*
 * Keep the demo store on globalThis so it survives
 * normal hot reloads better during development.
 */
const globalStore = globalThis as typeof globalThis & {
  __biteoraStaffStore?: StaffUser[];
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");

  const hash = createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");

  return `${salt}:${hash}`;
}

if (!globalStore.__biteoraStaffStore) {
  globalStore.__biteoraStaffStore = [
    {
      id: "demo-owner-001",
      name: "Restaurant Owner",
      email: "owner@biteora.com",
      role: "OWNER",
      passwordHash: hashPassword("Biteora@123"),
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

const staffStore = globalStore.__biteoraStaffStore;

function isOwner(request: Request): boolean {
  const cookieHeader =
    request.headers.get("cookie") || "";

  const sessionMatch = cookieHeader.match(
    /(?:^|;\s*)biteora_session=([^;]+)/,
  );

  const roleMatch = cookieHeader.match(
    /(?:^|;\s*)biteora_role=([^;]+)/,
  );

  return (
    Boolean(sessionMatch?.[1]) &&
    roleMatch?.[1] === "OWNER"
  );
}

/*
 * GET /api/staff
 *
 * Return all staff without password information.
 */
export async function GET(request: Request) {
  if (!isOwner(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Owner access required.",
      },
      { status: 403 },
    );
  }

  const staff = staffStore.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  }));

  return NextResponse.json({
    success: true,
    staff,
  });
}

/*
 * POST /api/staff
 *
 * Owner creates ADMIN or WORKER.
 */
export async function POST(request: Request) {
  if (!isOwner(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Only the owner can create staff accounts.",
      },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();

    const name =
      typeof body?.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    const role = body?.role;

    /*
     * Required field validation.
     */
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, email, password and role are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Basic email validation.
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 },
      );
    }

    /*
     * Password policy.
     */
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        { status: 400 },
      );
    }

    /*
     * Owner cannot create another Owner
     * through this form.
     */
    if (role !== "ADMIN" && role !== "WORKER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only Admin or Worker accounts can be created.",
        },
        { status: 400 },
      );
    }

    /*
     * Prevent duplicate email.
     */
    const existingUser = staffStore.find(
      (user) =>
        user.email.toLowerCase() === email,
    );

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const newUser: StaffUser = {
      id: `staff-${Date.now()}`,
      name,
      email,
      role: role as "ADMIN" | "WORKER",
      passwordHash: hashPassword(password),
      active: true,
      createdAt: new Date().toISOString(),
    };

    staffStore.push(newUser);

    /*
     * NEVER return passwordHash to the browser.
     */
    return NextResponse.json(
      {
        success: true,
        message: `${role} account created successfully.`,
        staff: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          active: newUser.active,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 },
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

/*
 * DELETE /api/staff?id=...
 *
 * Owner can revoke access.
 */
export async function DELETE(request: Request) {
  if (!isOwner(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Only the owner can revoke access.",
      },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const staffId = url.searchParams.get("id");

  if (!staffId) {
    return NextResponse.json(
      {
        success: false,
        message: "Staff ID is required.",
      },
      { status: 400 },
    );
  }

  const userIndex = staffStore.findIndex(
    (user) => user.id === staffId,
  );

  if (userIndex === -1) {
    return NextResponse.json(
      {
        success: false,
        message: "Staff account not found.",
      },
      { status: 404 },
    );
  }

  const user = staffStore[userIndex];

  /*
   * Never allow the Owner account to be removed
   * from this interface.
   */
  if (user.role === "OWNER") {
    return NextResponse.json(
      {
        success: false,
        message:
          "The owner account cannot be removed here.",
      },
      { status: 400 },
    );
  }

  staffStore.splice(userIndex, 1);

  return NextResponse.json({
    success: true,
    message: "Staff access revoked successfully.",
  });
}