import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@cloud_cost_analyzer/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, username, image_url, last_sign_in_at } = evt.data;

    const primaryEmail = email_addresses?.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return new Response("No primary email found", { status: 400 });
    }

    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        username: username,
        imageUrl: image_url,
        lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
      },
    });

    return new Response("User created", { status: 201 });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, username, image_url, last_sign_in_at } = evt.data;

    const primaryEmail = email_addresses?.find(
      (e) => e.id === evt.data.primary_email_address_id
    )?.email_address;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        ...(primaryEmail && { email: primaryEmail }),
        firstName: first_name,
        lastName: last_name,
        username: username,
        imageUrl: image_url,
        lastSignInAt: last_sign_in_at ? new Date(last_sign_in_at) : null,
      },
    });

    return new Response("User updated", { status: 200 });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      await prisma.user.delete({
        where: { clerkId: id },
      });
    }

    return new Response("User deleted", { status: 200 });
  }

  return new Response("Webhook received", { status: 200 });
}
