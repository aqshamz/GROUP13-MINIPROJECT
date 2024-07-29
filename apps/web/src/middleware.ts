"use server"
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRoleAndUserIdFromCookie } from '@/utils/roleFromCookie'; 

const routes = {
    event: ['/event'],
    transaction: ['/transaction'],
    ticket: ['/ticket'],
    management: ['/management'],
    managementEvent: ['/management/event'],
    managementTransaction: ['/management/transaction'],
    managementTicket: ['/management/ticket'],
    managementStatistic: ['/management/statistic'],
    public: ['/login', '/register']
};

export default async function middleware(req: NextRequest) {
    try {
        const path = req.nextUrl.pathname;

        // Allow access to public routes
        if (routes.public.includes(path)) {
            return NextResponse.next();
        }

        // Get user data from cookies
        const data = await getRoleAndUserIdFromCookie();
        const role = data?.role;

        // Define route requirements
        const routeRequirements = [
            { routes: routes.event, requiredRole: null },
            { routes: routes.transaction, requiredRole: "Customer" },
            { routes: routes.ticket, requiredRole: "Customer" },
            { routes: routes.management, requiredRole: "Organizer" },
            { routes: routes.managementEvent, requiredRole: "Organizer" },
            { routes: routes.managementTransaction, requiredRole: "Organizer" },
            { routes: routes.managementTicket, requiredRole: "Organizer" },
            { routes: routes.managementStatistic, requiredRole: "Organizer" }
        ];

        // Check route requirements
        for (const requirement of routeRequirements) {
            if (requirement.routes.includes(path)) {
                if (!data || (requirement.requiredRole && role !== requirement.requiredRole)) {
                    return NextResponse.redirect(new URL('/login', req.nextUrl));
                }
                break;
            }
        }

        return NextResponse.next();
    } catch (err) {
        // Redirect to login on any error
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg)).*)'
    ],};
