import React, { useState } from 'react';
import Dashboard from '../../components/admin/dashboard';
import { Helmet } from "react-helmet";
import { Menu, X } from 'lucide-react'; // Assuming you're using lucide-react for icons

const Admin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Helmet>
                <title>Admin | Zang Global</title>
            </Helmet>
           
                <div className="flex-1 overflow-auto p-4">
                    <Dashboard />
                </div>
        
        </div>
    );
};

export default Admin;