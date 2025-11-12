import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 bg-card border-t border-card">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-400 mb-2">
          A solo project by <span className="text-white font-semibold">Mohamed Hossameldin Abdelaziz</span> with AI assistance
        </p>
        <p className="text-gray-400 mb-4">
          No other human team members - built entirely by me with the support of AI technologies
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Mail className="w-4 h-4" />
          <a 
            href="mailto:Amrikyy@gmail.com" 
            className="text-primary hover:text-primary-hover transition-colors"
          >
            Amrikyy@gmail.com
          </a>
        </div>
        <p className="text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Axiom ID. All rights reserved.
        </p>
      </div>
    </footer>
  );
}