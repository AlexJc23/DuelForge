import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import '../DeleteDeckModal/DeleteDeckModal.css'
import { removeComment } from "../../redux/comments";
const DeleteCommentModal = ({ comment_id }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const response = await dispatch(removeComment(comment_id));
        if (response.ok) {
            closeModal();
        } else {
            console.error('Failed to delete deck:', response.error);
        }
    };

    return (
        <div className='modal'>
            <h1 className='delete-title'>Confirm Delete</h1>
            <div className='delete-desc'>Are you sure you want to remove your comment?</div>
            <button className='delete-button' onClick={handleDelete}>
                Yes (Delete Comment)
            </button>
            <button className='keep-button' onClick={closeModal}>
                No (Keep Comment)
            </button>
        </div>
    );
};

export default DeleteCommentModal;
