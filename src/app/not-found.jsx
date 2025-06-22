import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
      <Image
        src="https://undraw.co/api/illustrations/54e44dfc-66b3-4c53-ae20-64f841baedb7" // any illustration URL
        alt="Page not found"
        width={400}
        height={300}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-6">
        Sorry, we couldn’t find the page you were looking for.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go back home
      </Link>
    </div>
  )
}
