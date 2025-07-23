import { Facebook, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Logo textColor="text-white" className="mb-6" />
            <p className="text-gray-400 mb-4">Journey to Inner Peace</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[hsl(70,71%,62%)] transition-colors">
                <Facebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(70,71%,62%)] transition-colors">
                <Instagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(70,71%,62%)] transition-colors">
                <Youtube className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Journeys</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/journeys" className="hover:text-[hsl(70,71%,62%)] transition-colors">Sacred Retreats</Link></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Cultural Immersions</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Meditation Tours</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Pilgrimage Paths</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-[hsl(70,71%,62%)] transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[hsl(70,71%,62%)] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 The Nirvanist. All rights reserved. Journey to Inner Peace.</p>
        </div>
      </div>
    </footer>
  );
}
