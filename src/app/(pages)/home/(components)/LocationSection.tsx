import Link from 'next/link';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

export default function LocationSection() {
  return (
    <div className="location bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="relative h-[400px] bg-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0334736885387!2d124.54096892475976!3d8.496376441622843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32fff57b1254d349%3A0x764e134372f4576f!2sSecret%20AJ%20Resort!5e0!3m2!1sen!2sph!4v1710401188037!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="filter contrast-125"
          ></iframe>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6 text-[#333333]">
            Find Us
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-blue-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#333333]">Our Location</h3>
                <p className="text-[#444444] leading-relaxed">
                  Tuling, Patag Opol Misamis Oriental,<br />
                  Opol, Philippines, 9016
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                href="https://www.google.com/maps/place/Secret+AJ+Resort/@8.4963764,124.5409689,17z/data=!4m6!3m5!1s0x32fff57b1254d349:0x764e134372f4576f!8m2!3d8.4976636!4d124.543021!16s%2Fg%2F11t75d92lx"
                target="_blank"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                <FaDirections className="text-xl" />
                <span>Get Directions</span>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-[#444444] italic">
                "Experience the serenity and breathtaking views of our exclusive getaway, 
                perfectly situated in the heart of nature."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 