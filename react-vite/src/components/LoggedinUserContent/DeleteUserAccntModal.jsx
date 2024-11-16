import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { thunkDeleteAccount, thunkLogout } from "../../redux/session";
import './LoggedinUserContent.css'

const DeleteUserAccountModal = ({ user_id }) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State to handle password input and confirmation form visibility
    const [password, setPassword] = useState('');
    const [showConfirmForm, setShowConfirmForm] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        // Dispatch the delete account thunk with the password
        const response = await dispatch(thunkDeleteAccount(user_id, password));
        if (response?.error) {
            setError(response.error); // Display error if password is incorrect
        } else {
            closeModal();
            dispatch(thunkLogout())
            navigate('/');
        }
    };

    const openConfirm = () => {
        setShowConfirmForm(true); // Show password input form when confirming
    };

    return (
        <div className='modal'>
            <h1 className='delete-title'>Confirm Delete</h1>
            <div className='delete-desc'>Are you sure you want to delete your account?</div>

            {/* Show password input form if the user clicks 'Confirm' */}
            {showConfirmForm ? (
                <form className="delete-form" onSubmit={handleDelete}>
                    <label>
                        Confirm Password to Delete Account:
                        <input
                            style={{marginTop: '10px'}}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {error && <div className="error">{error}</div>} {/* Show error message if password is incorrect */}
                    <div className="delete-accnt-btns">
                        <button type="submit" className='delete-button'>Delete Account</button>
                        <button type="button" className='keep-button' onClick={() => setShowConfirmForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <button  className='delete-button' onClick={openConfirm}>
                        Confirm
                    </button>
                    <button className='keep-button' onClick={closeModal}>
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
};

export default DeleteUserAccountModal;
