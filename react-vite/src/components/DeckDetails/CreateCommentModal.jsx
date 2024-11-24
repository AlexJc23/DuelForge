import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createComment, getComments } from "../../redux/comments";

const CreateCommentModal = ({ deck_id }) => {
    console.log('lions ',deck_id)
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const [comment, setComment] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare payload and dispatch action
        const response = await dispatch(createComment(comment, deck_id));

        // Check for errors or proceed
        if (response?.errors) {
            setErrors(response.errors); // Set errors returned from backend
        } else {
            dispatch(getComments(deck_id))
            closeModal(); // Close the modal on success
        }
    };

    return (
        <div className="modal">
            <h1 className="create-title">Create a Comment</h1>
            <form onSubmit={handleSubmit} className="create-comment-form">
                <label htmlFor="comment-input" className="comment-label">
                    Your Comment
                </label>
                <textarea
                    id="comment-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="comment-textarea"
                    required
                />
                {errors.comment && <p className="error-message">{errors.comment}</p>}

                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCommentModal;
