import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom";

export default function ProfilePage(){
    const { accessToken, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    if(accessToken){
        return (
            <>
                <h2>Profile page</h2>
                <div style={{maxWidth: "500px", overflowWrap: "break-word", margin: "20px 0 "}}>Token: {accessToken}</div>
                <button onClick={() => {
                    logout();
                    navigate("/")
                }}>Logout</button>
            </>
        )
    }
}