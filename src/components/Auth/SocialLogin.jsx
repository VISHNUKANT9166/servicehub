function SocialLogin() {
    return (
        <div className="mt-6">

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm text-gray-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

                <button
                    type="button"
                    className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
                >
                    Google
                </button>

                <button
                    type="button"
                    className="border border-gray-300 rounded-xl py-3 font-medium hover:bg-gray-50 transition"
                >
                    GitHub
                </button>

            </div>

        </div>
    );
}

export default SocialLogin;