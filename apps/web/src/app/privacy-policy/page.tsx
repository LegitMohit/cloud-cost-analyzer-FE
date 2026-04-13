"use client";

import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <Shield className="w-4 h-4" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111118]/80 p-8 shadow-xl shadow-violet-500/10">
          <div className="prose prose-invert prose-violet max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-zinc-400 leading-relaxed">
                Cloud Vento (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cloud cost optimization platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                <li>Account information (email address, password)</li>
                <li>AWS credentials for cost analysis</li>
                <li>Usage data and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                <li>Provide and maintain our cloud cost optimization services</li>
                <li>Analyze your AWS usage and generate cost reports</li>
                <li>Provide AI-powered recommendations for cost savings</li>
                <li>Improve and personalize your experience</li>
                <li>Send you important updates and notifications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-zinc-400 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your AWS credentials are encrypted and stored securely. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">5. Data Retention</h2>
              <p className="text-zinc-400 leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes we collected it for. You can request deletion of your account and associated data at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Under applicable data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">7. Third-Party Services</h2>
              <p className="text-zinc-400 leading-relaxed">
                Our service integrates with Amazon Web Services (AWS) to provide cost analysis. We are not responsible for AWS privacy practices. Please review AWS&apos;s privacy policy for information about how they handle your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
              <p className="text-zinc-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p className="text-zinc-400 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at support@cloudvento.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}