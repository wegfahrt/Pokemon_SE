import "./DropdownContent.css"
import {forwardRef} from "react";

const DropdownContent = forwardRef((props: any, ref: any) => {
    const {children, open, top}: { children: any, open: boolean, top: number } = props
    return (
        <div className={`dropdown-content ${open ? "content-open" : null}`}
             ref={ref}
             style={{top: top ? `${top}px` : "100%"}}>
            {children}
        </div>
    );
});

export default DropdownContent;