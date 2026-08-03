function DashboardLayout({ sidebar, children }) {

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="grid grid-cols-12 gap-8">

                    {/* Sidebar */}

                    <aside className="col-span-3">

                        {sidebar}

                    </aside>

                    {/* Main Content */}

                    <main className="col-span-9">

                        {children}

                    </main>

                </div>

            </div>

        </div>

    );

}

export default DashboardLayout;