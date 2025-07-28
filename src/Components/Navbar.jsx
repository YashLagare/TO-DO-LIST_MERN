import { LucideLogOut, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../store/AuthContext';

const Navbar = ({ onOpenSidebar }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        toast.success("👋 Logged out successfully");
    };

    return (
        <div>
            <header className="bg-white shadow-sm border-b px-2 py-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            TO-DO Board
                        </h1>
                        {user && (
                            <span>Welcome,{user.fullName}!🤗🥳</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenSidebar}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors shadow-lg"
                        >
                            <Plus size={20} />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
                            title='Logout'
                        >
                            <LucideLogOut size={20}/>
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Navbar