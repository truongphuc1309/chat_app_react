import { useContext, useEffect } from 'react';
import { AppContext, useAppContext } from '../contexts/AppContext';
import { ConversationContext } from '../contexts/ConversationContext';
import Contacts from './Contacts';
import Profile from './Profile';
import SideBarHeader from './SideBarHeader';

function SideBar() {
    const innerWidth = window.innerWidth;
    const { conversation } = useAppContext();
    const { openConversationBox, setOpenConversationBox } = conversation;
    const { profile } = useContext(AppContext);
    const { openProfile, setOpenProfile } = profile;
    useEffect(() => {
        if (innerWidth < 768) setOpenConversationBox(false);
    }, []);

    return (
        <div
            className={`relative bg-transparent lg:w-[30%] md:w-[340px] md:block ${
                !openConversationBox ? 'block' : 'hidden'
            } w-[100%] p-[14px] flex flex-col`}
        >
            <SideBarHeader />
            <Contacts />
            {openProfile && <Profile />}
        </div>
    );
}

export default SideBar;
