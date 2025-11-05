const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-black h-14 shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4 overflow-visible">
                <img
                src="/fastbreak-logo.svg"
                alt="Logo"
                className="absolute top-[-35px] left-8 h-[126px] w-[126px] object-contain filter invert"
                />
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-6 text-white font-medium">
                <a href="/" className="hover:text-blue-600 transition">Home</a>
                <a href="/players" className="hover:text-blue-600 transition">Players</a>
                <a href="/games" className="hover:text-blue-600 transition">Games</a>
            </nav>
            </div>
        </header>
    );
};

export default Header;
