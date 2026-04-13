import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

const categories = [
  { name: "Auto & Repair", count: 12, icon: "🔧" },
  { name: "Food & Dining", count: 18, icon: "🍔" },
  { name: "Home Services", count: 15, icon: "🏠" },
  { name: "Health & Wellness", count: 9, icon: "💊" },
  { name: "Legal & Finance", count: 7, icon: "⚖️" },
  { name: "Beauty & Personal", count: 11, icon: "💇" },
  { name: "Shopping & Retail", count: 14, icon: "🛍️" },
  { name: "Education & Childcare", count: 6, icon: "📚" },
];

const featuredBusinesses = [
  { name: "Comfort Air Solutions", category: "Home Services", description: "Heating, cooling, and air quality solutions for Flint families. Licensed, insured, and locally owned since 2005.", phone: "(810) 555-0123", featured: true },
  { name: "Motor City Garage", category: "Auto & Repair", description: "Family-owned auto repair since 1998. Honest pricing, certified mechanics, and free diagnostics for Flint residents.", phone: "(810) 555-0456", featured: true },
  { name: "Flint Family Dental", category: "Health & Wellness", description: "Comprehensive dental care for the whole family. Accepting new patients and most insurance plans.", phone: "(810) 555-0789", featured: true },
];

export default function BusinessDirectoryPage() {
  return (
    <div>
      <section className="text-white" style={{ backgroundColor: '#0f1a2e' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 text-center">
          <h1 className="text-3xl font-black mb-2">Flint Business Directory</h1>
          <p style={{ color: '#8a9ab5' }} className="max-w-xl mx-auto">Support local. Find trusted businesses in Flint &amp; Genesee County.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{cat.name}</h3>
              <p className="text-gray-400 text-xs">{cat.count} businesses</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#f0ead6', color: '#8a7530' }}>Featured</span>
            Spotlight Businesses
          </h2>
          <Link href="/advertise" className="text-sm font-semibold" style={{ color: '#c9a84c' }}>Get listed &rarr;</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {featuredBusinesses.map((biz) => (
            <div key={biz.name} className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow" style={{ border: '2px solid #e8ddb8' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{biz.name}</h3>
                  <span className="text-gray-500 text-xs">{biz.category}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: '#f0ead6', color: '#8a7530' }}>Featured</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{biz.description}</p>
              <p className="text-gray-900 text-sm font-medium">{biz.phone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-8 text-white text-center" style={{ background: 'linear-gradient(135deg, #1a2744, #0f1a2e)' }}>
          <h2 className="text-2xl font-black mb-2">Own a Business in Flint?</h2>
          <p className="max-w-lg mx-auto mb-6" style={{ color: '#8a9ab5' }}>Get your business in front of thousands of local customers. Featured listings start at just $29/month.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/advertise" className="text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#c9a84c' }}>Get Featured</Link>
            <Link href="/submit" className="font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors" style={{ backgroundColor: '#1a2744', color: '#8a9ab5' }}>Submit Free Listing</Link>
          </div>
        </div>
      </div>

      <div className="mt-6"><NewsletterSignup variant="banner" /></div>
    </div>
  );
}
