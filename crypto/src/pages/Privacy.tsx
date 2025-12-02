import { FC } from "react";
import { FaShieldAlt, FaLock, FaCookie, FaUserShield, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Privacy: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-b border-gray-700">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <FaShieldAlt className="text-teal-400 text-4xl md:text-5xl" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-gray-300 text-center max-w-2xl mx-auto text-sm md:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Introduction */}
        <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700 mb-8">
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            At <span className="text-teal-400 font-semibold">Crypto Tracker</span>, we take your privacy seriously. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
            our website and use our services. Please read this privacy policy carefully.
          </p>
        </div>

        {/* Information We Collect */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-teal-500/20 p-3 rounded-lg">
              <FaUserShield className="text-teal-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Information We Collect</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Register for an account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Subscribe to our newsletter</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Contact us through forms or email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Use our services and features</span>
                </li>
              </ul>
              <p className="text-gray-400 mt-4 text-xs md:text-sm italic">
                This may include: name, email address, phone number, and any other information you choose to provide.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Automatically Collected Information</h3>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                When you visit our website, we automatically collect certain information about your device:
              </p>
              <ul className="space-y-2 text-gray-300 text-sm md:text-base">
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>IP address and browser type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Operating system and device information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Pages visited and time spent on pages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-400 mr-2">•</span>
                  <span>Referring website and search terms</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FaLock className="text-blue-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">How We Use Your Information</h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <ul className="space-y-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To provide, operate, and maintain our services</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To improve, personalize, and expand our services</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To understand and analyze how you use our website</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To develop new products, services, and features</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To communicate with you about updates and promotional offers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To send you technical notices and security alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">✓</span>
                <span>To prevent fraud and ensure security</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <FaCookie className="text-orange-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Cookies and Tracking</h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              We use cookies and similar tracking technologies to track activity on our service and store certain information. 
              Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600 mt-4">
              <h4 className="text-white font-semibold mb-2">Types of Cookies We Use:</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span><strong>Essential Cookies:</strong> Required for the website to function properly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  <span><strong>Preference Cookies:</strong> Remember your settings and preferences</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <FaShieldAlt className="text-green-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Data Security</h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 mt-4">
              <p className="text-green-300 text-sm">
                <strong>Security Measures:</strong> We use encryption, secure servers, regular security audits, 
                and access controls to protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <FaExclamationTriangle className="text-purple-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Third-Party Services</h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Our service may contain links to third-party websites or services that are not owned or controlled by 
              Crypto Tracker. We have no control over and assume no responsibility for the content, privacy policies, 
              or practices of any third-party sites or services.
            </p>
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30 mt-4">
              <p className="text-purple-300 text-sm">
                <strong>Note:</strong> We integrate with cryptocurrency APIs and analytics services to provide real-time data. 
                These services may have their own privacy policies.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-teal-500/20 p-3 rounded-lg">
              <FaUserShield className="text-teal-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Your Privacy Rights</h2>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-300 mb-4 text-sm md:text-base">You have the right to:</p>
            <ul className="space-y-3 text-gray-300 text-sm md:text-base">
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Access and receive a copy of your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Rectify inaccurate personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Request deletion of your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Object to processing of your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Request restriction of processing your personal data</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-400 mr-2 mt-1">→</span>
                <span>Withdraw consent at any time</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contact Us */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FaEnvelope className="text-blue-400 text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Contact Us</h2>
          </div>

          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-lg p-6 border border-teal-500/30">
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="space-y-3 text-gray-300 text-sm md:text-base">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-teal-400" />
                <a href="mailto:Hariharanath247@gmail.com" className="hover:text-teal-400 transition-colors">
                  Hariharanath247@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaUserShield className="text-teal-400" />
                <span>Data Protection Officer: Crypto Tracker Team</span>
              </div>
            </div>
          </div>
        </section>

        {/* Updates to Policy */}
        <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/30 mb-8">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
            <FaExclamationTriangle className="text-yellow-400 mr-2" />
            Changes to This Privacy Policy
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review 
            this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
