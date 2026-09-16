import "./CustomCheckbox.css"

export default function CustomCheckbox({ title, onChange, checked }: { title: string, onChange: (checked: boolean) => void, checked?: boolean }) {
    return (
        <label className="custom-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="checkmark"></span>
            {title}
        </label>
    )
}