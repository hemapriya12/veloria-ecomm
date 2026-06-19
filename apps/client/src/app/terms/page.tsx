export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto mt-8 pb-16 flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-sm text-gray-400 mt-2">Last updated: January 1, 2025</p>
      </div>

      {[
        {
          title: "1. Acceptance of Terms",
          body: `By accessing or using Veloria, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform. These terms apply to all users, including buyers, sellers, and visitors.`,
        },
        {
          title: "2. Use of the Platform",
          body: `You must be at least 18 years old to use Veloria. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You may not use Veloria to:\n• List counterfeit, stolen, or prohibited goods\n• Engage in fraudulent transactions\n• Harass, threaten, or harm other users\n• Violate any applicable laws or regulations`,
        },
        {
          title: "3. Buyer Responsibilities",
          body: `As a buyer, you agree to provide accurate shipping and payment information. You are responsible for reviewing product descriptions before purchasing. Veloria facilitates transactions between buyers and sellers but is not responsible for the quality, safety, or legality of products listed by third-party sellers.`,
        },
        {
          title: "4. Seller Responsibilities",
          body: `Sellers are independent third parties, not employees of Veloria. Sellers agree to:\n• Provide accurate product descriptions and images\n• Fulfill orders in a timely manner\n• Handle returns in accordance with Veloria's return policy\n• Not list prohibited or illegal items\n• Comply with all applicable laws and regulations`,
        },
        {
          title: "5. Payments and Fees",
          body: `All payments are processed securely through our payment partners. Veloria charges a platform fee on each completed transaction. Prices listed are in USD and include applicable taxes where required. Veloria reserves the right to change fee structures with 30 days' notice to sellers.`,
        },
        {
          title: "6. Returns and Refunds",
          body: `Buyers may request a return within 30 days of delivery for most items. Sellers are required to accept returns for items that are not as described, damaged, or defective. Refunds are processed within 5-10 business days of return approval. Certain categories may have different return windows as specified on the product page.`,
        },
        {
          title: "7. Intellectual Property",
          body: `The Veloria platform, including its design, logo, and content created by Veloria, is owned by Veloria Inc. and protected by intellectual property laws. Sellers retain ownership of their product listings and images. By listing on Veloria, sellers grant Veloria a non-exclusive license to display their content on the platform.`,
        },
        {
          title: "8. Limitation of Liability",
          body: `Veloria is not liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid for the transaction giving rise to the claim. Some jurisdictions do not allow the exclusion of certain warranties, so the above limitations may not apply to you.`,
        },
        {
          title: "9. Changes to Terms",
          body: `We reserve the right to modify these terms at any time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of Veloria after changes take effect constitutes acceptance of the revised terms.`,
        },
        {
          title: "10. Contact",
          body: `For legal inquiries, contact us at:\n\nVeloria Inc.\nEmail: legal@veloria.com`,
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
