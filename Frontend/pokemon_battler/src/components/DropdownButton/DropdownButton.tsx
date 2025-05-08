import "./DropdownButton.css"
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {forwardRef} from "react";

const DropdownButton = forwardRef((props: any, ref: any) => 
{
    const {children, open, toggle} = props
    
    return (
        <div onClick={toggle}
             className={`dropdown-btn ${open ? "button-open" : ""}`}
             ref  = {ref}>
            {children}
            <span className={"toggle-icon"}>
            {open ? <FaChevronUp/> : <FaChevronDown/>}
            </span>
        </div>
    );
});

export default DropdownButton;