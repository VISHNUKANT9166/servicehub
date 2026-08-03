function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {subtitle}
                    </p>

                </div>

                {children}

            </div>

        </div>
    );
}

export default AuthLayout;