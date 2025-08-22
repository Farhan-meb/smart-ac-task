import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const error = searchParams.get("error");

    console.error("NextAuth Error:", error);

    return NextResponse.json({
        error: error || "Unknown error",
        timestamp: new Date().toISOString(),
    });
}
