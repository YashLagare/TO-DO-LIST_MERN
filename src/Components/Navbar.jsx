import { Plus } from 'lucide-react';

const Navbar = ({ onOpenSidebar }) => {
    return (
        <div>
            <header className="bg-white shadow-sm border-b px-2 py-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        TO-DO Board
                    </h1>
                    <button
                        onClick={onOpenSidebar}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors shadow-lg"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Navbar