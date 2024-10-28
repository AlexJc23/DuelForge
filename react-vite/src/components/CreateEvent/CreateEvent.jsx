import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { thunkAuthenticate } from "../../redux/session";
import { FaArrowLeftLong } from "react-icons/fa6";
import './CreateEvent.css'
import { createEvent } from "../../redux/events";
import Footer from "../Footer/Footer";

const CreateEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const user = useSelector((state) => state.session.user);

    if (!user) return (navigate('/home'))

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

        if (location.length < 10) error['location'] = "Please provide an address";

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateData()) {

            const serverResponse = await dispatch(createEvent({
                owner_id: user.id,
                name,
                description,
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                location,
                price: parseFloat(price),
                imageUrl
            }));
            console.log(serverResponse)
            if (serverResponse && serverResponse.errors) {
                setErrors((error) => ({ ...error, ...serverResponse.errors }));
            }

            navigate('/events');

        }
    };


    const handleGoBack = () => {
        navigate(-1);
    };



    return isLoaded ? (
        <>
            <div className="details-body">
                <div className="top-details">
                    <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                        <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                    </button>
                </div>
                <div id="create-evnt">
                    <form onSubmit={handleSubmit}>
                        <section id="title-create" className="glow-on-hover-create">
                            <h2>Title of Event<span className="required"></span></h2>
                            <p>Give your event a special title to grab attention</p>
                            <input
                                placeholder="Title"
                                style={{ color: 'white' }}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            {errors.name && <p className="err-msg">{errors.name}</p>}
                        </section>
                        <section id="description-create" className="glow-on-hover-create">
                            <h2>Description<span className="required"></span></h2>
                            <p>Don't be shy... Tell us all the details about this event!</p>
                            <textarea
                                placeholder="Description..."
                                style={{ color: 'white', height: '100px', resize: 'none', overflow: 'auto' }}
                                value={description}

                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            {errors.description && <p className="err-msg">{errors.description}</p>}
                        </section>
                        <section style={{display: 'flex', flexDirection: 'row', gap: '100px'}} className="glow-on-hover-create">
                            <div className="dates">
                                <h2>Start Date<span className="required"></span></h2>
                                <input
                                    style={{ color: 'white', marginTop: '10px', width: '290px' }}
                                    type='date'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="dates">
                                <h2>End Date<span className="required"></span></h2>
                                <input
                                    style={{ color: 'white', marginTop: '10px', width: '290px' }}
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            {errors.endDate && <p className="err-msg">{errors.endDate}</p>}
                            </div>
                        </section>
                        <section id="location-create" className="glow-on-hover-create">
                            <h2>Location<span className="required"></span></h2>
                            <p>Now, where will this event take place?</p>
                            <input
                                style={{ color: 'white' }}
                                placeholder="123 Random St, Columbus, AB 12345"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                            {errors.location && <p className="err-msg">{errors.location}</p>}
                        </section>
                        <section id="price-create" className="glow-on-hover-create">
                            <h2>Price<span className="required"></span></h2>
                            <p>Is this event free or do people need to come prepared to pay?</p>
                            <div style={{display:'flex', alignItems: 'center', gap: '5px'}}>
                            <span>$</span><input
                                style={{ color: 'white'}}
                                placeholder="00"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                            </div>
                            {errors.price && <p className="err-msg">{errors.price}</p>}
                        </section>
                        <section id="image-create" className="glow-on-hover-create">
                            <h2>Image<span className="required"></span></h2>
                            <p>Lastly, add an image to make your event stick out to the rest of them.</p>
                            <input
                                style={{ color: 'white' }}
                                placeholder="Image URL"
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                            />
                            {errors.imageUrl && <p className="err-msg">{errors.imageUrl}</p>}
                        </section>
                        <section className="form-bttm">
                            <button className="glow-on-hover" onClick={handleGoBack}>Cancel</button>
                            <button type="submit" className="glow-on-hover">Publish</button>
                        </section>
                    </form>
                </div>
            </div>
            <Footer />
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

export default CreateEvent;
