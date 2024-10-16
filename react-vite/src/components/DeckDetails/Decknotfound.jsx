import { FaArrowLeftLong } from "react-icons/fa6";


const DeckNotFound = () => {

    const handleGoBack = () => {
        navigate(-1);  // Navigate to the previous page in the browser's history
    };

    return (
        <>
            <div style={{width: '700px', margin: '3px auto'}} className="top-details">
                    <button className="glow-on-hover" style={{ background: 'black' }} onClick={handleGoBack}>
                        <FaArrowLeftLong style={{ marginRight: '5px' }} /> Back
                    </button>
                </div>
            <h1 style={{margin: '40px auto', width: '400px'}}>It doesnt exist bro move on</h1>
        </>
    )
}

export default DeckNotFound;
