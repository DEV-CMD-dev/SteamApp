import "./CustomCheckbox.css"
export default function CustomCheckbox({title} : {title:string}) {
    return (
        <label className="custom-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            {title}
        </label>
    )
}