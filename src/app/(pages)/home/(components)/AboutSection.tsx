import Link from 'next/link';

export default function AboutSection() {
  return (
    <div className="about-us bg-gradient-to-br from-white to-gray-50 p-12 rounded-2xl shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-[#333333] text-center">
          About <span className="text-blue-600">Secret Aj Resort</span>
        </h2>
        <div className="space-y-6 text-center">
          <p className="text-xl leading-relaxed text-[#444444]">
            Secret Aj Resort is a tranquil getaway nestled in nature's beauty, 
            where traditional Filipino hospitality meets modern comfort.
          </p>
          <p className="text-lg leading-relaxed text-[#444444]">
            Our goal is to provide exceptional service and unforgettable experiences
            in our peaceful tropical paradise. Each detail is carefully crafted to
            ensure your stay is both relaxing and memorable.
          </p>
          <div className="pt-6">
            <Link href="/booking">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 font-medium">
                Book Your Stay Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 