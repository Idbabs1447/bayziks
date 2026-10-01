import { handleInquiry } from "@/lib/server/inquiries";
export const runtime = "nodejs";
export async function POST(request: Request) { return handleInquiry(request, "collaborate"); }
