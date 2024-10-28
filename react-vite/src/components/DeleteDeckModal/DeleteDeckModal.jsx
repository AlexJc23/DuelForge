import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { deleteDeck } from "../../redux/decks";
import './DeleteDeckModal.css'
const DeleteDeckModal = ({ deck_id }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const response = await dispatch(deleteDeck(deck_id));
        if (response.ok) {
            closeModal();
            navigate('/decks');
        } else {
            console.error('Failed to delete deck:', response.error);
        }
    };

    return (
        <div className='modal'>
            <h1 className='delete-title'>Confirm Delete</h1>
            <div className='delete-desc'>Are you sure you want to delete this Deck?</div>
            <button className='delete-button' onClick={handleDelete}>
                Yes (Delete Deck)
            </button>
            <button className='keep-button' onClick={closeModal}>
                No (Keep Deck)
            </button>
        </div>
    );
};

export default DeleteDeckModal;
