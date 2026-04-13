import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-gray-400 mt-16" style={{ backgroundColor: '#0a1220' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/fpo-logo.png" alt="FPO" width={36} height={36} className="rounded-lg" />
              <span className="text-white font-black text-lg">FLINT POLICE OPS</span>
            </div>
            <p className="text-sm leading-relaxed">
              Flint&apos;s trusted source for crime updates, local news, and community information. Keeping our city informed and connected.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#c9a84c' }}>News</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news/crime" className="hover:text-white transition-colors">Crime &amp; Safety</Link></li>
              <li><Link href="/news/local" className="hover:text-white transition-colors">Local Updates</Link></li>
              <li><Link href="/news/community" className="hover:text-white transition-colors">Community Stories</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#c9a84c' }}>Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit a News Tip</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Submit an Event</Link></li>
              <li><Link href="/advertise" className="hover:text-white transition-colors">Advertise With Us</Link></li>
              <li><Link href="/business-directory" className="hover:text-white transition-colors">Business Directory</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#c9a84c' }}>Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://facebook.com/flintpoliceops" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="mailto:tips@flintpoliceops.com" className="hover:text-white transition-colors">tips@flintpoliceops.com</a></li>
              <li><Link href="#newsletter" className="hover:text-white transition-colors">Daily Newsletter</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ borderTop: '1px solid #1a2744' }}>
          <p>&copy; {new Date().getFullYear()} Flint Police Ops. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
