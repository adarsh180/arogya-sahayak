'use client'

import { Shield, Lock, Eye, Database, UserCheck, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last updated: December 10, 2024</span>
          </div>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
            <p className="text-gray-600 text-sm">All your data is encrypted and stored securely</p>
          </div>
          <div className="card text-center">
            <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No Data Sharing</h3>
            <p className="text-gray-600 text-sm">We never share your personal health information</p>
          </div>
          <div className="card text-center">
            <UserCheck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
            <p className="text-gray-600 text-sm">You control your data and can delete it anytime</p>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="card prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
          <p className="text-gray-700 mb-4">When you create an account, we collect:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Name and email address</li>
            <li>Phone number (optional)</li>
            <li>Age and gender (optional)</li>
            <li>Location (city/state)</li>
            <li>Preferred language</li>
            <li>Account type (patient/student)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Health Information</h3>
          <p className="text-gray-700 mb-4">With your consent, we may collect:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Symptoms and health concerns you report</li>
            <li>Health metrics you track (BMI, blood pressure, etc.)</li>
            <li>Medical history information you provide</li>
            <li>Medication reminders and schedules</li>
            <li>Chat conversations with our AI assistant</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Provide personalized AI medical assistance</li>
            <li>Track your health metrics and provide insights</li>
            <li>Send medication reminders and health notifications</li>
            <li>Improve our AI models and service quality</li>
            <li>Provide customer support</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
          <p className="text-gray-700 mb-4">We implement robust security measures:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>End-to-end encryption for all sensitive data</li>
            <li>Secure HTTPS connections for all communications</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication systems</li>
            <li>Secure cloud infrastructure with backup systems</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">We do NOT share your personal health information with:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Healthcare providers (unless you explicitly request)</li>
            <li>Insurance companies</li>
            <li>Employers</li>
            <li>Marketing companies</li>
            <li>Government agencies (except as required by law)</li>
          </ul>
          
          <p className="text-gray-700 mb-6">
            We may share anonymized, aggregated data for research purposes to improve healthcare technology, but this data cannot be traced back to individual users.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Access all your personal data we have stored</li>
            <li>Update or correct your information anytime</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data in a portable format</li>
            <li>Opt-out of non-essential communications</li>
            <li>Request clarification about our data practices</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-6">
            We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies for advertising purposes. You can control cookie settings in your browser.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">We use trusted third-party services for:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
            <li>Authentication (Google OAuth)</li>
            <li>Database hosting (secure cloud providers)</li>
            <li>AI processing (with data encryption)</li>
            <li>Email communications</li>
          </ul>
          <p className="text-gray-700 mb-6">
            All third-party services are bound by strict data protection agreements and cannot access your personal health information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="text-gray-700 mb-6">
            We retain your data only as long as necessary to provide our services. You can delete your account anytime, which will permanently remove all your data from our systems within 30 days.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-700 mb-6">
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 mb-6">
            Your data is primarily stored in secure servers located in India. If data needs to be transferred internationally, we ensure appropriate safeguards are in place.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this privacy policy from time to time. We will notify you of any material changes via email or through our platform. Your continued use of the service after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@arogya-sahayak.com or through our contact page.
          </p>
        </div>

        {/* Data Protection Notice */}
        <div className="mt-8 card bg-green-50 border-green-200">
          <div className="text-center">
            <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Data is Protected</h3>
            <p className="text-gray-600 mb-4">
              We are committed to protecting your privacy and maintaining the security of your health information.
            </p>
            <a href="/contact" className="btn-primary">
              Contact Privacy Team
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © 2024 Arogya Sahayak. All rights reserved. Created by <strong>Adarsh Tiwari</strong> on 10/12/2024.
          </p>
        </div>
      </div>
    </div>
  )
}