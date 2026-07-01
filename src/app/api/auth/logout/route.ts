import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const next = request.nextUrl.searchParams.get('next') ?? '/signin';
    const response = NextResponse.redirect(new URL(next, request.url));

    response.cookies.delete('token');

    return response;
}

export async function POST() {
    const cookieStore = await cookies();

    cookieStore.delete('token');

    return NextResponse.json({ ok: true });
}
