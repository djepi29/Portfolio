export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-max section-padding">
        <div className="max-w-2xl mx-auto text-center text-gray-300">
          <p className="mb-2">
            I design and build apps, websites, and platforms tailored for entrepreneurs,
            service providers, and organizations in Ottawa and beyond.
          </p>
          <p className="text-sm text-gray-400 mb-6">Ottawa, Ontario, Canada</p>
          <p className="text-sm border-t border-gray-700 pt-6">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
