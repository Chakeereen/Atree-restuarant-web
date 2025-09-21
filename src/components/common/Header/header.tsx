import { Darkmode } from "../Navbar/DarkMode"

const HeaderMain = () => {
  return (
          <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
              <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">ATREE</h1>
              <nav className="space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition">
                  Home
                </a>
                <a href="/about" className="text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 transition">
                  About Us
                </a>
                  <Darkmode />
              </nav>
            </div>
          </header>
  )
}
export default HeaderMain