import "./Dropdown.css"
import DropdownButton from "../DropdownButton/DropdownButton.tsx";
import DropdownContent from "../DropdownContent/DropdownContent.tsx";
import {useState, useEffect, useRef,} from "react";

const Dropdown = ({buttontext, content}: { buttontext: string, content: any }) => {
    const [open, setOpen] = useState(false);
    const [dropdownTop, setDropdownTop] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("click", handler);

        return () => {
            document.removeEventListener("click", handler);
        }
    }, [dropdownRef])
    const toggleDropdown = () => {
        if(!open){
            const spaceRemaining = window.innerHeight - buttonRef.current!.getBoundingClientRect().bottom;
            const contentHeight = contentRef.current!.clientHeight;
            
            const topPosition = spaceRemaining > contentHeight ? 0 : spaceRemaining - contentHeight;
            setDropdownTop(topPosition);
        }
        setOpen((open) => !open);
    }
    return <div className={"dropdown"}
                ref={dropdownRef}>
        <DropdownButton
            toggle={toggleDropdown}
            open={open}
            ref={buttonRef}>
            {buttontext}
        </DropdownButton>
        <DropdownContent
            open={open}
            ref={contentRef}
            top={dropdownTop}>
            {content}
        </DropdownContent>
    </div>;
};

export default Dropdown;