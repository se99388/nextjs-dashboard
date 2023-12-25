import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

/**
 * recap auth:
 * 1. login-form.tsx - set username and password
 *
 * 2. action.ts - authenticate function call signIn('credential',{username,password}). signIn checked it by
 *    provider=>credentials=>authorize function in auth.ts
 *
 * 3. auth.ts  - execute provider=>credentials=>authorize({username,password}).
 *    if you passed the auth you get cookies token (authjs.session-token) and used it to get access to the protected pages
 *
 * 4. auth.config.ts - callback=>authorized. check if you authorized/loggedIn by the cookies token (authjs.session-token)
 *    if you are loggedIn and it is still on url of '/login'=> redirect to '/dashboard'
 *
 * 5. auth.config.ts - callback=>authorized. is loggedIn and url is '/dashboard' return true and continue to '/dashboard'
 *
 * 6. middleware.ts => each time you navigate to route that meets config.matcher the auth.config.ts - callback=>authorized will
 *    will be executed, and check that you are authorized by checking your auth (authjs.session-token)
 */
