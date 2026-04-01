'use client'

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../ui/Button";
import Toast, { ToastType } from "../ui/Toast"; 

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: ToastType }>({
    show: false,
    msg: "",
    type: "info",
  });

  const triggerToast = (msg: string, type: ToastType) => {
    setToast({ show: true, msg, type });
  };

  useEffect(() => {
    fetch("/api/auth/session").catch(() => {});
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const renderTimer = setTimeout(() => {
      triggerToast("Waking up server (Render Free Tier)... please wait.", "info");
    }, 2000);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    clearTimeout(renderTimer);

    if (res?.error) {
      setError("Invalid email or password");
      triggerToast("Login failed. Please check your credentials.", "error");
      setIsLoading(false);
    } else if (res?.ok) {
      const sess = await getSession();
      const userRole = sess?.user?.role;

      const routes: Record<string, string> = {
        EMPLOYEE: "/reimbursement-form",
        HR: "/hr/dashboard",
        ACCOUNTANT: "/accountant",
        MANAGER: "/reimbursement-form",
      };

      router.push(routes[userRole as string] || "/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
     
      {toast.show && (
        <Toast
          message={toast.msg}
          type={toast.type}
          duration={5000}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

    
        <div className="hidden md:flex md:w-1/2 bg-indigo-50 p-8 lg:p-12 flex-col justify-center items-center text-center">
          <div className="max-w-sm">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Welcome Back
            </h2>
            <p className="text-slate-600 text-base lg:text-lg mb-8">
              Sign in to manage your reimbursements and track your claims in real-time.
            </p>
            <div className="relative w-full aspect-square max-w-[300px] mx-auto">
              <Image
                src="/logo.png"
                alt="App Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>


        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="md:hidden text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
              <p className="text-slate-500 text-sm">Access your reimbursement portal</p>
            </div>

            <h2 className="hidden md:block text-3xl font-bold text-slate-800 mb-8 text-left">
              Account Login
            </h2>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="•••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-sm">
              Don't have an account? <span className="text-indigo-600 font-semibold cursor-pointer">Contact HR</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;