
import ParticlesComponent from './particles';
import './landing.css'
import { NavLink } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Landing = () => {
    return (
        <div id="landing">
        <div className="wrapper">
            <ParticlesComponent id='particles'/>
            <div id="landing-txt">
                <h3 id='land-txt'>Welcome to DuelForge, the ultimate platform for Yu-Gi-Oh! fans to build custom decks and discover exciting events. Whether you're perfecting your strategy or looking for local competitions, DuelForge connects you with the community. Join the action, showcase your skills, and rise to the top of the dueling world!</h3>
                {/* <NavLink to={'/home'}>Explore</NavLink> */}
                <button  class="glow-on-hover" type="button"> <NavLink to={'/home'}>Explore <FaArrowRight /></NavLink></button>
            </div>
        </div>
            </div>
    )
}

export default Landing;
