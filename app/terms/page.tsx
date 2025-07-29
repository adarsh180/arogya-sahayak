'use client'

import { FileText, Calendar, Shield, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last updated: December 10, 2024</span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="card bg-yellow-50 border-yellow-200 mb-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h3>
              <p className="text-yellow-700 text-sm">
                Arogya Sahayak is an AI-powered health information platform. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="card prose prose-gray max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-6">
            By accessing and using Arogya Sahayak ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            Arogya Sahayak is an AI-powered medical assistance platform that provides:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>AI-powered medical information and guidance</li>
            <li>Symptom checking and analysis</li>
            <li>Health tracking and monitoring tools</li>
            <li>Medical education resources for students</li>
            <li>Multilingual support in 29+ Indian languages</li>
            <li>Medicine reminders and health management</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
          <p className="text-gray-700 mb-4">As a user of Arogya Sahayak, you agree to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Provide accurate and truthful information</li>
            <li>Use the service for lawful purposes only</li>
            <li>Not attempt to harm or disrupt the service</li>
            <li>Respect the intellectual property rights</li>
            <li>Understand that AI advice is not a substitute for professional medical care</li>
            <li>Seek immediate medical attention for emergencies</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Medical Information Disclaimer</h2>
          <p className="text-gray-700 mb-6">
            The information provided by Arogya Sahayak is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
          <p className="text-gray-700 mb-6">
            Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-700 mb-6">
            All content, features, and functionality of Arogya Sahayak are owned by Adarsh Tiwari and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            Arogya Sahayak and its creator shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
          <p className="text-gray-700 mb-6">
            We strive to maintain the service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications to Terms</h2>
          <p className="text-gray-700 mb-6">
            We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
          <p className="text-gray-700 mb-6">
            We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-700 mb-6">
            These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions about these Terms of Service, please contact us at support@arogya-sahayak.com or visit our contact page.
          </p>
        </div>

        {/* Contact Support */}
        <div className="mt-8 card bg-blue-50 border-blue-200">
          <div className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Questions about our Terms?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help clarify any questions you may have.
            </p>
            <a href="/contact" className="btn-primary">
              Contact Support
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