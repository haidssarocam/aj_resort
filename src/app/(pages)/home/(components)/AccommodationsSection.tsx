import Image from 'next/image';

export default function AccommodationsSection() {
  return (
    <div className="accommodations">
      <h2 className="text-3xl font-bold text-center mb-8 text-[#333333]">Our Accommodations</h2>
      <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-80">
            <Image
              src="/images/home/1746804205_cottage.jpg"
              alt="Tropical Nipa Cottage"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-semibold mb-3 text-[#333333]">Tropical Nipa Cottage</h3>
            <p className="text-[#444444] mb-6">
              Experience authentic Filipino hospitality in our traditional nipa cottages. 
              Surrounded by lush tropical gardens, each cottage features:
            </p>
            <ul className="text-[#444444] mb-6 space-y-2">
              <li>• Comfortable seating area with garden views</li>
              <li>• Traditional thatched roof for natural cooling</li>
              <li>• White curtains for privacy and ambiance</li>
              <li>• Peaceful garden setting with tropical plants</li>
            </ul>
            <div className="border-t pt-6">
              <h4 className="font-semibold text-xl mb-4 text-[#333333]">Pricing Options:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-lg mb-2 text-[#333333]">Night Stay</h5>
                  <p className="text-[#444444]"><span className="text-[#555555]">Hours:</span> 5PM - 8AM</p>
                  <p className="text-xl font-bold text-[#2563eb] mt-2">₱ 1,000</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-lg mb-2 text-[#333333]">Extended Stay</h5>
                  <p className="text-[#444444]"><span className="text-[#555555]">Hours:</span> 1:30PM - 11AM</p>
                  <p className="text-xl font-bold text-[#2563eb] mt-2">₱ 2,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 