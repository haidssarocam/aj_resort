const rules = [
  {
    title: "No Smoking Policy",
    description: "No smoking inside the cottages for everyone's comfort and safety."
  },
  {
    title: "Pet Policy",
    description: "Pets are not allowed on the property to maintain cleanliness and guest comfort."
  },
  {
    title: "Check-in & Check-out",
    description: "Check-in time is from 2:00 PM, and check-out time is 12:00 PM."
  },
  {
    title: "Guest Respect",
    description: "Respect the privacy and comfort of other guests during your stay."
  }
];

export default function ResortRulesSection() {
  return (
    <div className="resort-rules">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-[#333333] text-center">
          Resort <span className="text-blue-600">Guidelines</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {rules.map((rule, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#333333]">{rule.title}</h3>
                  <p className="text-[#444444] leading-relaxed">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
          <p className="text-[#444444] italic">
            "These guidelines are designed to ensure all our guests enjoy a peaceful and comfortable stay.
            We appreciate your cooperation in maintaining the tranquil atmosphere of our resort."
          </p>
        </div>
      </div>
    </div>
  );
} 