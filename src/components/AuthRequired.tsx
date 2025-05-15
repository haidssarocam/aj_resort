import Link from 'next/link';

const AuthRequired = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">
            This page requires you to be logged in. Please use the login or signup options in the top-right corner of the page to access this content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired; 