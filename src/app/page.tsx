import Image from 'next/image';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled for components that use browser APIs
const ItemsComponent = dynamic(() => import('@/components/Items'), { 
  ssr: false,
  loading: () => <div className="text-center p-8">Loading items management...</div>
});

// Feature card component for homepage
function FeatureCard({ title, description, icon }: { 
  title: string; 
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <span className="text-blue-600 text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Next.js MongoDB Accelerator</h1>
              <p className="text-xl mb-6">
                A high-performance, production-ready starter for building MongoDB-powered applications with Next.js
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#features"
                  className="bg-white text-blue-700 px-6 py-2 rounded-md font-semibold hover:bg-blue-50"
                >
                  Learn More
                </a>
                <a 
                  href="#items"
                  className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:bg-opacity-10"
                >
                  Demo
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Docker Ready"
              description="Multi-stage Docker build optimized for both development and production environments."
              icon="🐳"
            />
            <FeatureCard
              title="MongoDB Integration"
              description="Built-in connection pooling and retry mechanism for reliable database operations."
              icon="🗄️"
            />
            <FeatureCard
              title="TailwindCSS"
              description="Utility-first CSS framework for rapid UI development with minimal bundle size."
              icon="🎨"
            />
            <FeatureCard
              title="Performance Optimized"
              description="Next.js with standalone output mode and optimized Docker configuration."
              icon="⚡"
            />
            <FeatureCard
              title="Security Headers"
              description="Pre-configured security headers to protect your application."
              icon="🔒"
            />
            <FeatureCard
              title="API Ready"
              description="RESTful API endpoints with proper error handling and validation."
              icon="🔌"
            />
          </div>
        </div>
      </section>

      {/* Demo section */}
      <section id="items" className="py-16 bg-gray-100">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Items Management Demo</h2>
          <Suspense fallback={<div className="text-center p-8">Loading items...</div>}>
            <ItemsComponent />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Next.js MongoDB Accelerator</h3>
              <p className="text-gray-400">High-performance starter template</p>
            </div>
            <div>
              <p className="text-gray-400">
                Built with <span className="text-blue-400">❤️</span> using Next.js, MongoDB, and Docker
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}