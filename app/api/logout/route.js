import { deleteSession } from "@/app/lib/session"
import { NextResponse } from "next/server";

export async function GET(req){
    await deleteSession()
    return NextResponse.redirect(req.headers.get('x-forwarded-proto') || 'http' + "://" + req.headers.get("host") + "/");
}