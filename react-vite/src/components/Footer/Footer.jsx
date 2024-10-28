import { useNavigate } from "react-router-dom";
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate()

    const handleHome = () => {
        navigate('/home')
    }


    return (

    <footer className="footer" >
        {/* <div>
            <img src="/logo.svg" alt="DuelForge Logo" onClick={handleHome}></img>
        </div> */}
        <div >
            <p>© {currentYear} DuelForge. All rights reserved.</p>
        </div>
        <div className="my-stuff">
        </div>
    </footer>

    )
}


export default Footer;
