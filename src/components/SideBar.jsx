import { Outlet } from 'react-router-dom';
import ConversationProvider, {
    ConversationContext,
} from '../contexts/ConversationContext';
import Contacts from './Contacts';
import Profile from './Profile';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';

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
            {/* <ConversationProvider> */}
            {/* <Outlet /> */}
            <Contacts />
            {openProfile && <Profile />}
            {/* </ConversationProvider> */}
        </div>
    );
}

export default SideBar;
