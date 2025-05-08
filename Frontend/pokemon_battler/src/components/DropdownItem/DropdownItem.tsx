import "./DropdownItem.css"

const DropdownItem = ({children, onClick}: { children: any, onClick: any }) => {
    return (
        <div className={"dropdown-item"}
             onClick={onClick}>
            {children}
        </div>
    );
};

export default DropdownItem;