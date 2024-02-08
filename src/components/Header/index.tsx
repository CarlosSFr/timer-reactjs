import { HeaderContainer } from "./styles";
import logoPomodoro from "../../assets/logo-pomodoro.png";
import { Timer, Scroll } from "phosphor-react"
import { NavLink } from "react-router-dom";  

export function Header(){
    return (
        <HeaderContainer>
            <img src={logoPomodoro} alt="" width={40}/>
            <nav>
                <NavLink to="/" title="Home Page">
                    <Timer size={24}/>
                </NavLink>
                <NavLink to="/history" title="History">
                    <Scroll size={24}/>
                </NavLink>
            </nav>


        </HeaderContainer>
    )
}