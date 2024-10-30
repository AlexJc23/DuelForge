import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import Footer from "../Footer/Footer";
import { getConversations, getMessages } from '../../redux/messages';

const Messaging = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const conversations = useSelector((state) => state.messageReducer.conversations);
    const allConvos = conversations ? Object.values(conversations) : [];

    const messages = useSelector((state) => state.messageReducer.messages);
    
    // Fetch messages for the first conversation
    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                await dispatch(getConversations());

                // Get the ID of the first conversation
                const firstConversationId = allConvos.length > 0 ? allConvos[0].id : null;

                // Fetch messages only if there is a conversation
                if (firstConversationId) {
                    await dispatch(getMessages(firstConversationId));
                }
            } catch (error) {
                setError('Failed to load messages');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, [dispatch, allConvos]);

    return isLoading ? (
        <div id="loading">
                <h1 className='loading'>
                    <span className="let1">l</span>
                    <span className="let2">o</span>
                    <span className="let3">a</span>
                    <span className="let4">d</span>
                    <span className="let5">i</span>
                    <span className="let6">n</span>
                    <span className="let7">g</span>
                </h1>
            </div>
    ) : (
        <>
            <h1>Hello World!</h1>

        </>
    );
};

export default Messaging;
