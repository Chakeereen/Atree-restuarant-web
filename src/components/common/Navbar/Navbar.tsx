import { Darkmode } from "./DarkMode";
import DropdownListMenu from "./DropdownListMenu";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="w-full transition-colors duration-300 bg-gradient-to-r from-green-300 via-teal-300 to-cyan-300 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-6 px-6 w-full">
        <Logo />

        <div className="flex items-center gap-4">
          <Darkmode />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
