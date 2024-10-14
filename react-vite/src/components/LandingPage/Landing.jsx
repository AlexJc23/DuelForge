
import ParticlesComponent from './particles';
import './landing.css'

const Landing = () => {
    return (
        <div id="landing">
        <div className="wrapper">
            <ParticlesComponent id='particles'/>
            <div id="landing-txt">
                <h3>Hey there!</h3>
                <h1>I'm <span id="name-landing">Alex Carl</span>,</h1>
                <h3>A full-stack developer who turns coffee into code and ideas into awesome web experiences.</h3>
                <button>My Work</button>
            </div>
        </div>
            </div>
    )
}

export default Landing;
