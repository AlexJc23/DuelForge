import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkAuthenticate } from "../../redux/session";
import { editAEvent, getOneEvent } from "../../redux/events";
import { FaArrowLeftLong } from 'react-icons/fa6';

const EditEvent = () => {
    const { event_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log('eeeeeeeeeeeeeeee ', event_id)

    const user = useSelector((state) => state.session.user);
    const event_by_id = useSelector(state => state.eventsReducer.eventDetail.event);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const formatDateToYMD = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchEventDetails = () => {
            dispatch(thunkAuthenticate())
                .then(() => {
                    dispatch(getOneEvent(event_id));
                    setIsLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching event details:", error);
                });
        };
        fetchEventDetails();
    }, [event_id, dispatch]);


    useEffect(() => {
        if (event_by_id) {
            setName(event_by_id.name || '');
            setDescription(event_by_id.description || '');
            setStartDate(formatDateToYMD(event_by_id.start_date) || '');
            setEndDate(formatDateToYMD(event_by_id.end_date) || '');
            setImageUrl(event_by_id.image.image_url || '');
            setPrice(event_by_id.price || '');
            setLocation(event_by_id.location || '');
        }
    }, [event_by_id]);

    const validateData = () => {
        const error = {};
        const fileArr = ['.png', '.jpg', '.jpeg'];

        if (name.length > 50) error['name'] = "Title must be shorter than 50 characters.";
        if (name.length < 5) error['name'] = "Title must be longer than 5 characters.";
        if (description.length < 10) error['description'] = "Description must be longer than 10 characters";
        if (description.length > 300) error['description'] = "Description must be shorter than 300 characters";
        if (isNaN(price) || price <= 0) error['price'] = "Price must be a valid number greater than 0";
        if (!fileArr.some(ext => imageUrl.endsWith(ext))) {
            error['imageUrl'] = 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (new Date(endDate) < new Date(startDate)) error['endDate'] = 'End date must be after the start date.';

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateData()) {



            const serverResponse = await dispatch(editAEvent({
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                location,
                price: parseFloat(price),
                imageUrl
            }, event_id));

            if (serverResponse && serverResponse.errors) {
                setErrors((error) => ({ ...error, ...serverResponse.errors }));
            } else {

                navigate(`/events/${event_id}`);
            }
        }
    };


    const handleGoBack = () => {
        navigate(-1);
    };

    return isLoaded ? (
        <>
            <div className="top-details">
                <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                    <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                </button>
            </div>
            <div id="create-evnt">
                <form onSubmit={handleSubmit}>
                    <section id="title-create">
                        <h2>Title of Event<span className="required">*</span></h2>
                        <p>Give your event a special title to grab attention</p>
                        <input
                            style={{ color: 'black' }}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="err-msg">{errors.name}</p>}
                    </section>
                    <section id="description-create">
                        <h2>Description<span className="required">*</span></h2>
                        <p>Don't be shy... Tell us all the details about this event!</p>
                        <input
                            style={{ color: 'black' }}
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {errors.description && <p className="err-msg">{errors.description}</p>}
                    </section>
                    <section id="dates-create">
                        <div className="dates">
                            <h2>Start Date<span className="required">*</span></h2>
                            <input
                                style={{ color: 'black' }}
                                type='date'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="dates">
                            <h2>End Date<span className="required">*</span></h2>
                            <input
                                style={{ color: 'black' }}
                                type='date'
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                        {errors.endDate && <p className="err-msg">{errors.endDate}</p>}
                    </section>
                    <section id="location-create">
                        <h2>Location<span className="required">*</span></h2>
                        <p>Now, where will this event take place?</p>
                        <input
                            style={{ color: 'black' }}
                            placeholder="123 Random St, Columbus, AB 12345"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                        {errors.location && <p className="err-msg">{errors.location}</p>}
                    </section>
                    <section id="price-create">
                        <h2>Price<span className="required">*</span></h2>
                        <p>Is this event free or do people need to come prepared to pay?</p>
                        $<input
                            style={{ color: 'black' }}
                            placeholder="00"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                        {errors.price && <p className="err-msg">{errors.price}</p>}
                    </section>
                    <section id="image-create">
                        <h2>Image<span className="required">*</span></h2>
                        <p>Lastly, add an image to make your event stick out to the rest of them.</p>
                        <input
                            style={{ color: 'black' }}
                            placeholder="Image URL"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />
                        {errors.imageUrl && <p className="err-msg">{errors.imageUrl}</p>}
                    </section>
                    <section className="form-bttm">
                        <button type="button" className="glow-on-hover" onClick={handleGoBack}>Cancel</button>
                        <button type="submit" className="glow-on-hover">Publish</button>
                    </section>
                </form>
            </div>
        </>
    ) : (
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
    );
};

export default EditEvent;
