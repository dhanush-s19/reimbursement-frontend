import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen max-w-7xl mx-auto px-4 md:px-6">
        {/* Left Content */}
        <div className="md:w-1/2 flex flex-col gap-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            ReimbursePro
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-green-700 opacity-90">
            Reimbursement Management Made Easy
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 opacity-90">
            Digitize your reimbursement workflow, track approvals in real-time,
            and ensure transparency across employees, accountants, HR teams,
            and managers.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-6 md:mt-8">
            <Link
              href="/login"
              className="bg-black text-white py-3 px-8 rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="md:w-1/2 relative w-full h-64 md:h-96 mb-8 md:mb-0">
          <Image
            src="/logo.png"
            alt="Reimbursement Illustration"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white flex flex-col justify-center min-h-screen px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              {
                title: "Online Reimbursement Submission",
                desc: "Employees can submit reimbursement requests and upload proof of payments online."
              },
              {
                title: "Role-Based Access Control",
                desc: "Different permissions for Employees, Accountants, HR, and Managers ensure proper workflow."
              },
              {
                title: "Automated Approval Workflow",
                desc: "Requests are automatically routed to the appropriate approver based on their role and amount."
              },
              {
                title: "Real-Time Tracking",
                desc: "Employees and managers can track the status of reimbursement requests in real-time."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 md:p-8 bg-gray-50 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-24 max-w-6xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12">
          Why Choose Our System?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
          By replacing manual email-based reimbursements with a centralized web platform,
          your organization can streamline approval processes, reduce delays, improve
          transparency, and maintain accurate records. Employees, accountants, HR teams,
          and managers all benefit from a structured workflow and real-time status updates.
        </p>
      </section>

      {/* Call to Action */}
      <section className="bg-black py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <Link
            href="/login"
            className="bg-white text-black py-3 px-10 md:px-12 rounded-xl font-semibold hover:bg-gray-100 transition shadow-md"
          >
            Sign In Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <p className="text-center text-white opacity-70 text-sm md:text-base">
          &copy; {new Date().getFullYear()} ReimbursePro. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;