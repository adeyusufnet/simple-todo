import { Link } from "react-router-dom"

export default function MenuComponent() {

    const styles = {
        display: "flex",
        padding: "10px 15px",
        backgroundColor: "blue",
        color: "white",
        borderRadius: "10px",
        textDecoration: "none",
        border: "none",
        outline: "none"
    }

    return (
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", position: "fixed", bottom: 0, left: 0, padding: "20px 30px", boxSizing: "border-box" }}>
            <Link style={{ ...styles }} to="/">Home</Link>
            <Link style={{ ...styles }} to="/product">Product</Link>
            <Link style={{ ...styles }} to="/transaction">Transaction</Link>
        </div>
    )
}