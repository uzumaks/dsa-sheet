import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen bg-[#101113] flex flex-col items-center justify-center p-6 text-center text-gray-200">
      <div className="w-12 h-12 rounded-xl bg-[#17181B] border border-[#292A2E] flex items-center justify-center text-emerald-400 font-semibold mb-4 text-lg">
        {'{ }'}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-400 max-w-sm mb-6">
        The requested problem or company page could not be located in DSASheeeet.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-md bg-[#17181B] border border-[#292A2E] hover:border-[#3E4148] text-sm text-gray-200 hover:text-white transition-all font-medium"
      >
        Return to Workspace
      </Link>
    </div>
  );
}
