import React, { useEffect, useState } from 'react'

// 邮箱配置弹窗：EmailJS 三项 ID + 接收邮箱，保存在本机 localStorage
export default function ConfigModal({ open, t, config, onSave, onClear, onClose }) {
  const [draft, setDraft] = useState(config)

  useEffect(() => {
    if (open) setDraft(config)
  }, [open, config])

  if (!open) return null

  const update = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }))

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="config-title">
        <div className="modal-header">
          <h2 id="config-title">{t.configTitle}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t.close}>×</button>
        </div>
        <div className="modal-body">
          <p className="hint">{t.configDesc}</p>
          {[
            ['serviceId', t.configService],
            ['templateId', t.configTemplate],
            ['publicKey', t.configPublic],
            ['toEmail', t.configToEmail],
          ].map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={`cfg-${key}`}>{label}</label>
              <input
                id={`cfg-${key}`}
                className="form-control"
                type={key === 'toEmail' ? 'email' : 'text'}
                value={draft[key] || ''}
                onChange={update(key)}
              />
            </div>
          ))}
          <p className="hint small">
            {t.configHint}{' '}
            <a href="https://dashboard.emailjs.com/" target="_blank" rel="noopener noreferrer">emailjs.com</a>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn ghost" onClick={onClear}>{t.configClear}</button>
          <button className="btn primary" onClick={() => onSave(draft)}>{t.configSave}</button>
        </div>
      </div>
    </div>
  )
}
