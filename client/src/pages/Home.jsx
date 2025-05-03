import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-6">
        <h1 className="text-3xl font-bold text-center">Welcome to My App</h1>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-3xl mx-auto">
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Home Page</h2>
          <p className="text-gray-700">
            This is a simple React homepage. Use this as a base layout and extend it with your own content and features.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-4 text-center text-sm text-gray-500">
        © 2025 My App. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
