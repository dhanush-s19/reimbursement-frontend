import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col bg-white text-slate-800">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between min-h-screen max-w-7xl mx-auto px-6 py-20 gap-12 overflow-hidden">
        {/* Left Content */}
        <div className="md:w-3/5 flex flex-col gap-8 text-center md:text-left items-center md:items-start z-10">
          {/* Refined Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-semibold tracking-tight">
            <TrendingUp size={14} className="mr-2" />
            Streamlined Expense Management
          </div>

          {/* The "Middle Ground" Title */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-[0.9]">
            Reimburse<span className="text-emerald-600">Pro</span>
          </h1>

          {/* Slightly More Impactful Description */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-medium">
            Stop chasing paper trails. Digitize your reimbursement workflow and
            track approvals in real-time with zero friction.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center md:justify-start gap-5 w-full mt-2">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg bg-slate-900 text-white hover:bg-slate-800 border-none shadow-xl transition-transform hover:-translate-y-0.5"
                rightIcon={<ArrowRight size={20} />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side - Logo */}
        <div className="md:w-2/5 flex justify-center items-center">
          <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100/40 blur-[100px] rounded-full" />
            <Image
              src="/logo.png"
              alt="ReimbursePro Logo"
              width={450}
              height={450}
              className="relative object-contain animate-in fade-in slide-in-from-right-8 duration-1000"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Section - Reduced Contrast */}
      <section className="py-16 bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Faster Processing", value: "85%" },
            { label: "Paper Saved", value: "10k+" },
            { label: "Active Users", value: "5000+" },
            { label: "System Uptime", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-extrabold text-emerald-400">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-2 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Built for modern finance.
            </h2>
            <p className="text-slate-600 text-lg font-medium">
              Simple tools to regain control over company spending.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Digital Submission",
                desc: "Upload receipts instantly via mobile or desktop. No more physical folders.",
                icon: <FileText className="text-emerald-600" />,
              },
              {
                title: "Role-Based Access",
                desc: "Granular permissions for Employees, Accountants, and Managers.",
                icon: <Users className="text-emerald-600" />,
              },
              {
                title: "Automated Routing",
                desc: "Requests automatically move to the right person based on department.",
                icon: <Zap className="text-emerald-600" />,
              },
              {
                title: "Full Audit Trail",
                desc: "Track every change and approval with timestamped precision.",
                icon: <ShieldCheck className="text-emerald-600" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-sm hover:shadow-md transition-shadow bg-white p-4"
              >
                <Card.Header className="pb-2">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <Card.Title className="text-2xl font-bold text-slate-900">
                    {feature.title}
                  </Card.Title>
                </Card.Header>
                <Card.Content>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Less extreme contrast than dark-mode-style */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-20 text-slate-900">
            The 3-Step Workflow
          </h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                step: "01",
                title: "Upload",
                text: "Snap a photo of your receipt and enter the total.",
              },
              {
                step: "02",
                title: "Approve",
                text: "Managers get notified instantly to review the claim.",
              },
              {
                step: "03",
                title: "Pay",
                text: "Finance settles the balance with a single click.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="text-8xl font-black text-emerald-100/60 absolute -top-12 -left-4 z-0">
                  {item.step}
                </div>
                <h4 className="text-xl font-extrabold mb-3 z-10 text-slate-900">
                  {item.title}
                </h4>
                <p className="text-slate-600 font-medium z-10">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action - Reduced Contrast */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-emerald-600 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl shadow-emerald-100">
            <div className="z-10 text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Modernize your <br /> finance team today.
              </h3>
              <p className="text-emerald-50 text-lg font-medium max-w-sm">
                Join the companies moving faster with paperless reimbursement.
              </p>
            </div>
            <div className="z-10">
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-slate-950 text-white hover:bg-slate-800 px-12 h-16 text-xl rounded-2xl shadow-xl"
                >
                  Sign In Now
                </Button>
              </Link>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-400 rounded-full opacity-50 blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-extrabold text-xs">
              RP
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-slate-950">
              ReimbursePro
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} ReimbursePro. No fluff, just
            finance.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;