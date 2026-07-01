import { NextResponse, type NextRequest } from 'next/server';

const TOKEN_COOKIE_NAME = 'token';
const SIGNIN_PATH = '/signin';
const AUTHENTICATED_HOME_PATH = '/panel';

const privateRoutes = ['/panel', '/checkout'];
const authRoutes = ['/signin', '/signup'];

function isRouteMatch(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

function redirectTo(pathname: string, request: NextRequest) {
    return NextResponse.redirect(new URL(pathname, request.url));
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
    const isAuthenticated = Boolean(token);

    if (!isAuthenticated && isRouteMatch(pathname, privateRoutes)) {
        const signinUrl = new URL(SIGNIN_PATH, request.url);
        signinUrl.searchParams.set('next', `${pathname}${search}`);

        return NextResponse.redirect(signinUrl);
    }

    if (isAuthenticated && isRouteMatch(pathname, authRoutes)) {
        return redirectTo(AUTHENTICATED_HOME_PATH, request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/panel/:path*',
        '/checkout/:path*',
        '/signin/:path*',
        '/signup/:path*',
    ],
};
