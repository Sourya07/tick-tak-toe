type Props = {
    value: "X" | "O" | null;
    onClick: () => void;
};

function Square({ value, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="w-16 h-16 border text-2xl font-bold flex items-center justify-center"
        >
            {value}
        </button>
    );
}

export default Square;