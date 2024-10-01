import { Outlet } from 'react-router-dom';

function SideBar() {
    return (
        <div className="w-[100%] h-screen">
            <Outlet />
        </div>
    );
}

export default SideBar;
