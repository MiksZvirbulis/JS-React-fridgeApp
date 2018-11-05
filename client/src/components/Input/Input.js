import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Input = (props) => {
  let formElement = ""
  switch(props.elementType) {
    case 'input':
    formElement = <input className={!props.valid ? "invalid" : null} value={props.value} onChange={props.changed} {...props.elementConfig} />
    break;
    case 'select':
    formElement = (
      <select defaultValue="disabled" onChange={props.changed} className={!props.valid ? "invalid" : null}>
        <option value="disabled" disabled>{props.elementConfig.placeholder}</option>
        {props.elementConfig.options.map(option => (
          <option key={option.value} value={option.value}>{option.display}</option>
        ))}
      </select>
    )
    break;
    case 'textarea':
    formElement = <textarea className={!props.valid ? "invalid" : null} value={props.value} onChange={props.changed} {...props.elementConfig} />
    break;
    case 'datePicker':
    formElement = <DatePicker className={!props.valid ? "invalid" : null} selected={props.value} onChange={props.changed} {...props.elementConfig} />
    break;
    default:
    formElement = <input className={!props.valid ? "invalid" : null} value={props.value} onChange={props.changed} {...props.elementConfig} />
  }
  return (
    <div>
      {formElement}
    </div>
  )
}

export default Input
