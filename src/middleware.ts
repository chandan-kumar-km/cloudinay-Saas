import { clerkMiddleware ,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const publicRoute=createRouteMatcher([
    "/signup",
    "/signin",
    "/",
    "/home"
])

const publicApiRoute=createRouteMatcher([
    "/api/videos"
])

export default  clerkMiddleware(async (auth,req)=>{
    const { userId } = await auth();
    const currentUrl = new URL(req.url)
    const isHomePage =currentUrl.pathname === "/"
    const isApiRequest=currentUrl.pathname.startsWith("/api")

    // he is loggedin
    if(userId && publicRoute(req) && isHomePage){
        console.log("hitted loggin redirect")
        return NextResponse.redirect(new URL("/home",req.url))
    }
    // not loggedin
    if(!userId){
        if(!publicRoute(req) && !publicApiRoute(req)){
           return NextResponse.redirect(new URL ("/signin",req.url))
        }
        if(isApiRequest && !publicApiRoute(req)){
            return NextResponse.redirect(new URL("/signin",req.url))
        }
    }
    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}