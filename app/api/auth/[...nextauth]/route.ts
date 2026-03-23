import NextAuth, {
  AuthOptions,
  Session,
  User as NextAuthUser,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface MyUser extends NextAuthUser {
  token?: string;
  role?: string;
}

interface MyJWT extends JWT {
  accessToken?: string;
  role?: string;
  sub?: string;
}

interface MySession extends Session {
  accessToken?: string;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    employeeId: string | null;
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Spring Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        const data = await res.json();
        console.log("Login response:", res.status, data);

        if (!res.ok || !data.token) return null;

        return {
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
          role: data.role,
          employeeId: data.employeeId,
        } as MyUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.role = user.role;
        token.employeeId = user.employeeId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.employeeId = token.employeeId as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
