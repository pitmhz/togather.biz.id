import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Domain Configuration
 * Configure these values based on your deployment environment
 */
const DOMAIN_CONFIG = {
    // Root domain serves the landing page
    rootDomain: 'togather.biz.id',
    // App subdomain serves the main application
    appSubdomain: 'app.togather.biz.id',
    // Internal route prefixes for future monorepo merge
    landingPrefix: '/landing',
    appPrefix: '/app',
};

/**
 * Paths that should be excluded from middleware processing
 */
const EXCLUDED_PATHS = [
    '/_next',
    '/api',
    '/static',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
];

/**
 * Check if path should be excluded from middleware
 */
function isExcludedPath(pathname: string): boolean {
    return EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Extract hostname from request
 * Handles various header configurations from different deployment platforms
 */
function getHostname(request: NextRequest): string {
    // Priority: x-forwarded-host > host header > URL hostname
    const forwardedHost = request.headers.get('x-forwarded-host');
    const hostHeader = request.headers.get('host');
    return forwardedHost || hostHeader || request.nextUrl.hostname;
}

/**
 * Determine if the request is from the app subdomain
 */
function isAppSubdomain(hostname: string): boolean {
    return (
        hostname === DOMAIN_CONFIG.appSubdomain ||
        hostname.startsWith('app.') ||
        hostname.includes('app.togather')
    );
}

/**
 * Determine if the request is from the root landing domain
 */
function isLandingDomain(hostname: string): boolean {
    return (
        hostname === DOMAIN_CONFIG.rootDomain ||
        (!isAppSubdomain(hostname) && hostname.includes('togather'))
    );
}

/**
 * Main Middleware Function
 * 
 * Handles:
 * 1. Subdomain detection and routing
 * 2. Supabase session refresh
 * 3. Future-ready internal routing for monorepo merge
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip excluded paths
    if (isExcludedPath(pathname)) {
        return NextResponse.next();
    }

    // Create response for cookie handling
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Refresh Supabase session if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Refresh session - important for auth state
        await supabase.auth.getUser();
    }

    // Get hostname for routing decisions
    const hostname = getHostname(request);

    // --- FUTURE MONOREPO MERGE SUPPORT ---
    // When repositories are merged, enable internal routing by setting
    // ENABLE_INTERNAL_ROUTING=true in environment variables
    const enableInternalRouting = process.env.ENABLE_INTERNAL_ROUTING === 'true';

    if (enableInternalRouting) {
        // Rewrite requests to internal prefixes based on hostname
        if (isAppSubdomain(hostname)) {
            // Rewrite app.togather.biz.id/* to /app/*
            const url = request.nextUrl.clone();
            url.pathname = `${DOMAIN_CONFIG.appPrefix}${pathname}`;
            return NextResponse.rewrite(url);
        } else if (isLandingDomain(hostname)) {
            // Rewrite togather.biz.id/* to /landing/*
            const url = request.nextUrl.clone();
            url.pathname = `${DOMAIN_CONFIG.landingPrefix}${pathname}`;
            return NextResponse.rewrite(url);
        }
    }

    // Add hostname to headers for use in components
    response.headers.set('x-hostname', hostname);
    response.headers.set('x-is-app-subdomain', isAppSubdomain(hostname).toString());

    return response;
}

/**
 * Middleware Configuration
 * 
 * Match all paths except:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico (favicon)
 * - public folder files
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
