import Link from "next/link";
import { Brain, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-3xl font-bold">CareerMatch</span>
            <div className="text-sm font-medium text-emerald-400">AI-Powered Career Platform</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div>
            <h4 className="font-bold mb-4 text-lg">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Fitur AI</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Harga</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API Developer</Link></li>
              <li><Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Perusahaan</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Tentang CareerMatch</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Karir</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Kontak</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press Kit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Dukungan</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/help" className="hover:text-white transition-colors">Bantuan</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Dokumentasi</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">Status Platform</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Komunitas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Keamanan Data</Link></li>
              <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Proudly Made in Indonesia</span>
          </div>
          <p className="text-lg">&copy; 2024 CareerMatch. Semua hak dilindungi.</p>
          <p className="mt-2 text-gray-500">Platform AI untuk transformasi karir Indonesia yang lebih baik.</p>
        </div>
      </div>
    </footer>
  );
} 