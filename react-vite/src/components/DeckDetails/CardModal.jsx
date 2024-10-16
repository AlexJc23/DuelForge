

const CardModal = ({ url }) => {


    return (
        <div className="card-modal-container">
            <img src={url} alt="Zoomed Card" className="zoomed-card-image" />
        </div>
    );
};

export default CardModal;
