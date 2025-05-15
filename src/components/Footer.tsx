import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#333333] text-white py-4">
      <div className="container mx-auto text-center text-gray-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Secret Aj Resort. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 