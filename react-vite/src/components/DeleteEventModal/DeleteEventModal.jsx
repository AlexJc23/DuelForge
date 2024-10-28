import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../../redux/events";
import { useNavigate } from 'react-router-dom';
import './DeleteEventModal.css'

const DeleteEventModal = ({ event_id }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = () => {
        dispatch(deleteEvent(event_id))
            .then(() => {
                closeModal();
            })
            .then(navigate('/events'));
    };

    return (
        <div className='modal'>
            <h1 className='delete-title'>Confirm Delete</h1>
            <div className='delete-desc'>Are you sure you want to delete this Event?</div>
            <button className='delete-button' onClick={handleDelete}>
                Yes (Delete Event)
            </button>
            <button className='keep-button' onClick={closeModal}>
                No (Keep Event)
            </button>
        </div>
    );
};

export default DeleteEventModal;
