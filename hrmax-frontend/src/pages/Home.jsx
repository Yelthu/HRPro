import React from 'react'

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* <header className="bg-green-400 text-white p-4 text-center">
                <h1 className="text-pretty text-xl font-bold">Greeting, HOCO HRM Application</h1>
            </header> */}

            <main className="flex-1 p-5">
                <section className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-pretty">Announcements</h2>
                    <p className="text-gray-700 text-pretty">
                        Welcome to the HRM Application! Please take note of the following rules and announcements.
                    </p>
                    <ul className="list-disc list-inside mt-4">
                        <li>Rule 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                        <li>Rule 2: Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</li>
                        <li>Rule 3: Sed nisi. Nulla quis sem at nibh elementum imperdiet.</li>
                        <li>Rule 4: Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</li>
                        <li>Rule 5: Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</li>
                        <li>Rule 6: Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.</li>
                    </ul>
                    <p className="text-green-700 mt-6 text-pretty">
                        ***  Rules and Announcements will be update as per the conditions and terms. ***
                    </p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-pretty">News</h2>
                    <p className="text-gray-700 text-pretty">
                        Stay tuned for the latest updates and news about our company.
                    </p>
                </section>

            </main>
            <footer className="bg-gray-800 text-white text-center p-4 text-pretty">
                <p>&copy; {new Date().getFullYear()} HRM Application. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Home