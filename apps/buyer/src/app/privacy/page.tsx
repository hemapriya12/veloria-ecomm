export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 pb-16 flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mt-2">Last updated: January 1, 2025</p>
      </div>

      {[
        {
          title: "1. Information We Collect",
          body: `We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This includes your name, email address, shipping address, payment information, and any other information you choose to provide.\n\nWe also automatically collect certain information when you use Veloria, including your IP address, browser type, operating system, referring URLs, and information about your interactions with our platform.`,
        },
        {
          title: "2. How We Use Your Information",
          body: `We use the information we collect to:\n• Process transactions and send related information, including purchase confirmations and invoices\n• Send promotional communications, such as deals and new arrivals (you may opt out at any time)\n• Respond to your comments and questions and provide customer service\n• Monitor and analyze trends, usage, and activities on Veloria\n• Detect and prevent fraudulent transactions and other illegal activities`,
        },
        {
          title: "3. Sharing of Information",
          body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:\n• Sellers, to the extent necessary to fulfill your orders (e.g., your shipping address)\n• Payment processors who assist in processing your transactions\n• Service providers who perform services on our behalf\n• Law enforcement or government agencies when required by law`,
        },
        {
          title: "4. Data Security",
          body: `We implement industry-standard security measures including SSL encryption, secure data storage, and regular security audits to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
        },
        {
          title: "5. Cookies",
          body: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our Cookie Policy for more details.`,
        },
        {
          title: "6. Your Rights",
          body: `You have the right to access, update, or delete the information we hold about you. You may also request that we restrict processing of your personal data or object to our processing of your personal data. To exercise any of these rights, please contact us at privacy@veloria.com.`,
        },
        {
          title: "7. Changes to This Policy",
          body: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date above. Your continued use of Veloria after such changes constitutes your acceptance of the new Privacy Policy.`,
        },
        {
          title: "8. Contact Us",
          body: `If you have questions about this Privacy Policy, please contact us at:\n\nVeloria Inc.\nEmail: privacy@veloria.com`,
        },
      ].map(({ title, body }) => (
        <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-3">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{body}</p>
        </div>
      ))}
    </div>
  );
}
