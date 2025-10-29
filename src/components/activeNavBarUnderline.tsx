const ActiveNavBarUnderline = ({ active }: { active: boolean }) => {
    return (
        <span
            className={`absolute -bottom-2 h-1 bg-black rounded transition-all duration-300 transform origin-left
        ${active ? "w-7 opacity-50 scale-x-100 ease-in" : "w-0 opacity-0 scale-x-0"}`}
        ></span>
    );
};

export default ActiveNavBarUnderline