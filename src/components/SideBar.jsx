import { Outlet } from 'react-router-dom';
import ConversationProvider from '../contexts/ConversationContext';

function SideBar() {
    return (
        <div className="w-[100%] h-screen">
            <ConversationProvider>
                <Outlet />
            </ConversationProvider>
        </div>
    );
}

export default SideBar;
