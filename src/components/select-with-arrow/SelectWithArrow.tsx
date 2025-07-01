import React from "react";

interface SelectWithArrowProps {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    options: [string, string][];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
}

const SelectWithArrow: React.FC<SelectWithArrowProps> = ({
    label,
    name,
    value,
    required,
    options,
    onChange,
    placeholder,
}) => (
    <div className="col-md-4" style={{ position: "relative" }}>
        <div style={{ marginBottom: 16, marginTop: 8 }}>
            <label>
                {label} {required}
            </label>
            <select
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: "10px 40px 10px 12px",
                    borderRadius: 8,
                    border: "1px solid rgb(181, 188, 201)",
                    background: "#fff",
                    fontSize: 16,
                    color: "#111827",
                    outline: "none",
                    appearance: "none",
                    boxShadow: "none",
                }}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(([val, lab]) => (
                    <option key={val} value={val}>{lab}</option>
                ))}
            </select>
            <span
                style={{
                    pointerEvents: "none",
                    position: "absolute",
                    right: 20,
                    top: 44,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bdbdbd",
                }}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 8L10 12L14 8" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        </div>
    </div>
);

export default SelectWithArrow;