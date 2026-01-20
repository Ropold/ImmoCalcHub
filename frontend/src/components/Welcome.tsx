import {useNavigate} from "react-router-dom";
import "./styles/Welcome.css"
import welcomePic from "../assets/house-logo.jpg"

type WelcomeProps = {
    role: string;
}

export default function Welcome(props: Readonly<WelcomeProps>) {
    const navigate = useNavigate();

    return (
        <>
            <h2>Immo Calc Hub</h2>
            <div className="image-wrapper margin-top-20">
                <img
                    src={welcomePic}
                    alt="Welcome to ImmoCalcHub"
                    className="logo-welcome"
                    onClick={()=> navigate("/items")}
                />
            </div>
            <h3>Your role: {props.role}</h3>
        </>
    )
}