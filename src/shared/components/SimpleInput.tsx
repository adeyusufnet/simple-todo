interface SearchProps {
    labelName: string;
    inputName: string;
    inputId: string;
    inputType: string | "text";
    inputValue: any;
    onChange: (e: any) => void;
}

export default function InputComponent({
    labelName,
    inputName,
    inputId,
    inputType,
    inputValue,
    onChange,
}: SearchProps) {
    return (
        <div className="search-container">
            <label htmlFor={inputId}>{labelName}</label>
            <div className="input-container">
                <input
                    id={inputId}
                    name={inputName}
                    type={inputType}
                    placeholder="search something"
                    className="input-search"
                    value={inputValue}
                    onChange={onChange}
                    style={{
                        width: "100%"
                    }}
                />
            </div>
        </div>
    )
}