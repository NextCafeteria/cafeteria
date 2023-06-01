import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";

const useGoogleLogin = process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "true";
const useGithubLogin = process.env.NEXT_PUBLIC_GITHUB_LOGIN === "true";
let providers = [];
if (useGoogleLogin) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}
if (useGithubLogin) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const authOptions = {
  providers: providers,
  callbacks: {
    session: async ({ session, user, token }) => {
      session.user.id = user.id; // Add id value to user object so it is passed along with session
      session.user.role = user.role; // Add role value to user object so it is passed along with session
      session.user.isStaff = user.isStaff; // Add isStaff value to user object so it is passed along with session
      session.user.storeId = user.storeId; // Add isStaff value to user object so it is passed along with session
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  adapter: FirestoreAdapter({
    apiKey: process.env.FIREBASE_API_KEY,
    appId: process.env.FIREBASE_APP_ID,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  }),
};

export default NextAuth(authOptions);
