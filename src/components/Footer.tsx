function Footer() {
    return (
        <div className="sticky bottom-0 z-10 flex items-center justify-between h-16 px-6 py-4 bg-gray-800 text-white">
            <div className="text-sm">
                &copy; {new Date().getFullYear()} Max's Music Quiz. All rights reserved.
            </div>
            <div className="flex space-x-4">
                <a href="/terms" className="hover:underline">
                    Terms of Service
                </a>
                <a href="/privacy" className="hover:underline">
                    Privacy Policy
                </a>
            </div>
        </div>
    );
}

export default Footer;
