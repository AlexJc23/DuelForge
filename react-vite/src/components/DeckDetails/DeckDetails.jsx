import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getOneDeck } from "../../redux/decks";
import { getComments, editComment } from "../../redux/comments";
import { FaArrowLeftLong } from "react-icons/fa6";
import DeckNotFound from "./Decknotfound";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CardModal from "./CardModal";
import './Deckdetails.css';
import DeleteDeckModal from "../DeleteDeckModal/DeleteDeckModal";
import Footer from "../Footer/Footer";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import OpenModalMenuItemCard from "../OpenModalMenuItemCard/OpenModalMenuItemCard";
import ParticlesComponent from "../LandingPage/particles";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineModeEditOutline } from "react-icons/md";
import DeleteCommentModal from "./DeleteCommentModal";
import OpenModalButtonComment from "../OpenModalButton/OpenModalButtonComment";
import CreateCommentModal from "./CreateCommentModal";
import OpenModalButtonCreate from "../OpenModalButton/OpenModalButtonCreate";
import Loading from "../Loading/Loading";


const DeckDetails = () => {
    const { deck_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [error, setError] = useState({});

    const deckDetails = useSelector((state) => state.decksReducer.deckDetail.deck);
    const user = useSelector((state) => state.session.user);
    const comments = useSelector((state) => state.commentReducer.allComments);

    const allComments = comments ? Object.values(comments) : [];

    const handleGoBack = () => {
        navigate('/decks');
    };

    const deckCards = deckDetails?.cards || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getOneDeck(deck_id));
                await dispatch(getComments(deck_id));
            } catch (error) {
                console.error("Error fetching deck details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch, deck_id]);

    function timeAgo(dateInput) {
        const date = new Date(dateInput);
        const now = new Date();
        const diff = Math.abs(now - date);

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
        return `${years} year${years !== 1 ? 's' : ''} ago`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const serverResponse = await dispatch(
                editComment({ comment: editContent }, editCommentId)
            );
            await dispatch(getComments(deck_id));

            if (serverResponse && serverResponse.errors) {
                setError({ ...serverResponse.errors });
            } else {
                setEditCommentId(null); // Exit edit mode
                setEditContent(""); // Clear edit field
            }
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };


    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (!deckDetails) {
        return <DeckNotFound />;
    }

    const handleEditBtn = () => {
        navigate(`/decks/${deck_id}/update`);
    };

    return (
        <div >
            {/* <ParticlesComponent /> */}
            <div className="details-body">
                <div>
                    <div className="top-details">
                        <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                            <FaArrowLeftLong style={{ marginRight: '5px' }} /> Decks
                        </button>
                        <div style={{display:'flex', gap: '9px', justifyContent: 'center'}}>
                            <button className="glow-on-hover" onClick={handleEditBtn} style={{margin: '0 0 20px 0'}} hidden={(!user || user.id !== deckDetails.deck_owner.id)}>
                                Edit
                            </button>
                            <div hidden={(!user || user.id !== deckDetails.deck_owner.id)}>
                                <OpenModalButton
                                    buttonText={"Delete"}
                                    modalComponent={<DeleteDeckModal deck_id={deckDetails.id}/>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lower-details">
                    <div className="details-left">
                        {deckCards.length > 0 ? (
                            deckCards.map((card) => (
                                <OpenModalMenuItemCard
                                    key={card.id}
                                    itemText={<img className="details-card" src={card.image.image_url} alt="Card Image" />}
                                    onItemClick={() => setShowMenu(false)}
                                    modalComponent={<CardModal url={card.image.image_url}/>}
                                />
                            ))
                        ) : (
                            <div className="no-image">No image available</div>
                        )}
                    </div>

                    <div className="details-right">
                        <div className="details-upperright">
                            <h5>Owner: <NavLink to={`/profile/${deckDetails.deck_owner.id}`} >{deckDetails.deck_owner.username}</NavLink></h5>
                            <h3 style={{fontWeight: '800'}}>{deckDetails.name}</h3>
                            <p style={{width: '240px'}}>{deckDetails.description}</p>
                            <p>Cards in deck: {deckCards.length}</p>
                        </div>
                        <div className="details-lowerright">
                            <OpenModalButtonCreate
                                user={user}
                                buttonText={'Add a Comment'}
                                modalComponent={<CreateCommentModal deck_id={deck_id} />}
                            />
                            {allComments.length > 0 ? (
                                <div className="comment-section">
                                    {allComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((comment) => (
                                        <div key={comment.id} className={comment.id % 2 === 0 ? 'comment-wrapper odd' : 'comment-wrapper even'}>
                                            <div className='comment'>
                                                <h5>
                                                    <NavLink to={`/profile/${comment.comment_owner?.user_id}`}>
                                                        {comment.comment_owner?.username || "Unknown User"}
                                                    </NavLink>
                                                    <span hidden={editCommentId != null}>
                                                        {user && user.id === comment.comment_owner?.user_id && (
                                                            <MdOutlineModeEditOutline className="editbtn" onClick={() => {
                                                                setEditCommentId(comment.id);
                                                                setEditContent(comment.comment);
                                                            }} />
                                                        )}
                                                    </span>
                                                </h5>
                                                {editCommentId === comment.id ? (
                                                    <form onSubmit={handleSubmit}>
                                                        <label>
                                                            <textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                placeholder="Edit your comment here!"
                                                            />
                                                        </label>
                                                        {error.content && <div className="error">{error.content}</div>}
                                                        <button className="save-cstm-btn" type="submit">Save</button>
                                                        <button className='close-cstm-btn' type="button" onClick={() => setEditCommentId(null)}>Cancel</button>
                                                    </form>
                                                ) : (
                                                    <p>{comment.comment}</p>
                                                )}
                                                <p className="timestamp">{timeAgo(comment.created_at)}</p>
                                            </div>
                                                <div  className="delete-cmnt" hidden={(!user || user.id !== comment.comment_owner?.user_id)}>
                                                <OpenModalButtonComment
                                                    buttonText={<IoCloseOutline />}
                                                    modalComponent={<DeleteCommentModal comment_id={comment.id}/>}
                                                />
                                                </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>No comments yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DeckDetails;
