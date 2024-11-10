import { useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ConversationContext } from '../contexts/ConversationContext';
import Contacts from './Contacts';
import Profile from './Profile';

function SideBar() {
    const innerWidth = window.innerWidth;
    const { conversation } = useContext(ConversationContext);
    const { openConversationBox, setOpenConversationBox } = conversation;
    const { profile } = useContext(AppContext);
    const { openProfile, setOpenProfile } = profile;
    useEffect(() => {
        if (innerWidth < 768) setOpenConversationBox(false);
    }, []);

    return (
        <div
            className={`relative bg-[var(--secondary)] lg:w-[30%] md:w-[340px] md:block ${
                !openConversationBox ? 'block' : 'hidden'
            } w-[100%] h-screen p-2 flex flex-col`}
        >
            <Contacts />
            {openProfile && <Profile />}
        </div>
    );
}

export default SideBar;
