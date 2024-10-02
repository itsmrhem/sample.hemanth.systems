export default function ThankYou() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-4xl sm:text-5xl font-normal text-center sm:text-left text-indigo-600">Thank you for your purchase</h1>
            </div>
            <a href="/pay" className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">Home</a>
        </div>
    );
}