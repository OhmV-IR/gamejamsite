import { deleteSession } from "@/app/lib/session"
import { NextResponse } from "next/server";

export async function GET(req){
    await deleteSession()
    return NextResponse.redirect(process.env.DOMAIN + "/");
}