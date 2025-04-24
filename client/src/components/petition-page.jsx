import { motion } from "framer-motion";

export default function PetitionPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center p-6">
      <h1 className="text-4xl font-chinese mb-4">Shangri-La Petition Page</h1>
      <div className="bg-white shadow p-6 rounded w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Petitions</h2>
        <p className="text-gray-700">
          Explore and sign petitions to shape the future of Shangri-La.
        </p>
      </div>
    </div>
  );
}