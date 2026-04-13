"use client";

import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <FileText className="w-4 h-4" />
            <span>Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Terms and Conditions</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="rounded-[1.75rem] border border-[#1E1E2E] bg-[#111118]/80 p-8 shadow-xl shadow-violet-500/10">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              By accessing and using Cloud Vento (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-zinc-400 leading-relaxed">
              Cloud Vento is an AI-powered cloud cost optimization platform that provides insights, cost breakdowns, and recommendations for Amazon Web Services (AWS) infrastructure. The Service integrates with your AWS accounts to analyze spending patterns and suggest cost-saving opportunities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              You agree to:
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
              <li>Provide accurate and complete information when setting up your account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any part of the Service</li>
              <li>Not use the Service in any way that could damage, disable, or impair the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">4. AWS Integration</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              To use the Service, you must connect your AWS account(s). You agree to:
            </p>
            <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
              <li>Only connect AWS accounts you own or have authorization to use</li>
              <li>Provide valid AWS access credentials</li>
              <li>Allow Cloud Vento to read cost and usage data</li>
              <li>Comply with AWS terms of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-zinc-400 leading-relaxed">
              The Service, including all content, features, and functionality, is owned by Cloud Vento and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-zinc-400 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; CLOUD VENTO MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-zinc-400 leading-relaxed">
              IN NO EVENT SHALL CLOUD VENTO BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO ANY LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Termination</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">9. Governing Law</h2>
            <p className="text-zinc-400 leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may modify these Terms at any time. Your continued use of the Service after any such modification constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you should stop using the Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}