import React from 'react'

// 提交结果弹窗：展示填写摘要，提供复制、邮件客户端、打印操作
export default function ResultModal({ open, t, sent, summary, toEmail, onCopy, onClose, onPrint }) {
  if (!open) return null

  const mailto = `mailto:${toEmail || ''}?subject=${encodeURIComponent('老挝签证申请 / Laos Visa Application')}&body=${encodeURIComponent(summary)}`

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className="modal-header">
          <h2 id="result-title">{sent ? t.sendOk : t.successTitle}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t.close}>×</button>
        </div>
        <div className="modal-body">
          <p className="hint">{sent ? t.successDesc : t.notConfigured}</p>
          <h3 className="summary-heading">{t.summaryTitle}</h3>
          <pre className="summary-box">{summary}</pre>
        </div>
        <div className="modal-footer wrap">
          <button className="btn ghost" onClick={onClose}>{t.close}</button>
          <button className="btn ghost" onClick={onPrint}>{t.print}</button>
          <button className="btn ghost" onClick={onCopy}>{t.copy}</button>
          <a className="btn secondary" href={mailto}>{t.openMail}</a>
        </div>
      </div>
    </div>
  )
}
