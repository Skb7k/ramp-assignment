import classNames from "classnames"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  return (
    <label
      className={classNames("RampInputCheckbox--label", {
        "RampInputCheckbox--label-checked": checked,
        "RampInputCheckbox--label-disabled": disabled,
      })}
      data-testid={`RampInputCheckbox-${id}`}
    >
      <input
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}