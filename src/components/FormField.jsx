import React from 'react'
import { options } from '../config.js'

// 通用表单字段：根据 field.type 渲染 input / select / textarea
export default function FormField({ field, lang, value, error, onChange }) {
  const label = field.label[lang] || field.label.zh
  const placeholder = field.placeholder?.[lang] || ''

  const common = {
    id: field.name,
    name: field.name,
    value: value ?? '',
    onChange: (e) => {
      // uppercase 字段：输入自动转大写并去除空格（如护照号码）
      const raw = field.uppercase ? e.target.value.toUpperCase().replace(/\s+/g, '') : e.target.value
      onChange(field.name, raw)
    },
    className: `form-control${error ? ' has-error' : ''}`,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${field.name}-error` : undefined,
  }

  let control
  if (field.type === 'select') {
    const list = options[field.options] || []
    control = (
      <select {...common}>
        <option value="">{lang === 'zh' ? '— 请选择 —' : '-- Select --'}</option>
        {list.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt[lang] || opt.en}</option>
        ))}
      </select>
    )
  } else if (field.type === 'textarea') {
    control = <textarea {...common} rows={3} placeholder={placeholder} />
  } else {
    control = <input {...common} type={field.type} placeholder={placeholder} min={field.min} />
  }

  return (
    <div className={`field col-${field.col || 1}`}>
      <label htmlFor={field.name}>{label}</label>
      {control}
      {error && <span className="field-error" id={`${field.name}-error`} role="alert">{error}</span>}
    </div>
  )
}
