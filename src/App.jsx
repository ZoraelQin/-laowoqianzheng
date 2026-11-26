import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { ui, sections } from './config.js'
import { loadConfig, saveConfig, clearConfig, isConfigured, validate, buildSummary } from './utils.js'
import FormField from './components/FormField.jsx'
import ConfigModal from './components/ConfigModal.jsx'
import ResultModal from './components/ResultModal.jsx'

const today = new Date().toISOString().slice(0, 10)

export default function App() {
  const [lang, setLang] = useState('zh')
  const [values, setValues] = useState({ formDate: today })
  const [errors, setErrors] = useState({})
  const [config, setConfig] = useState(() => loadConfig())
  const [configOpen, setConfigOpen] = useState(false)
  const [result, setResult] = useState({ open: false, sent: false, summary: '' })
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  const t = ui[lang]

  const showToast = (msg) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2600)
  }

  const setValue = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }

  const handleLangChange = (next) => {
    setLang(next)
    setErrors({})
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values, t)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = document.querySelector('.has-error')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const summary = buildSummary(values, lang)

    if (!isConfigured(config)) {
      setResult({ open: true, sent: false, summary })
      return
    }

    setSending(true)
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          to_email: config.toEmail,
          from_name: `${values.surname || ''} ${values.givenNames || ''}`.trim(),
          reply_to: values.email || config.toEmail,
          form_data: summary,
          ...values,
        },
        config.publicKey,
      )
      setResult({ open: true, sent: true, summary })
    } catch {
      setResult({ open: true, sent: false, summary })
      showToast(t.sendFail)
    } finally {
      setSending(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = result.summary
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    showToast(t.copied)
  }

  const handleSaveConfig = (draft) => {
    saveConfig(draft)
    setConfig(draft)
    setConfigOpen(false)
    showToast(t.configSaved)
  }

  const handleClearConfig = () => {
    clearConfig()
    setConfig({ serviceId: '', templateId: '', publicKey: '', toEmail: '' })
    showToast(t.configCleared)
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">ລ</span>
            <div>
              <h1>{t.appTitle}</h1>
              <p>{t.appSubtitle}</p>
            </div>
          </div>
          <div className="header-actions no-print">
            <div className="lang-switch" role="group" aria-label={t.langLabel}>
              <button className={lang === 'zh' ? 'active' : ''} onClick={() => handleLangChange('zh')}>中文</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => handleLangChange('en')}>EN</button>
            </div>
            <button className="btn ghost small" onClick={() => setConfigOpen(true)}>{t.settings}</button>
          </div>
        </div>
      </header>

      <main className="container">
        <p className="intro">{t.intro}</p>

        <form onSubmit={handleSubmit} noValidate>
          {sections.map((section) => (
            <section className="card" key={section.id} aria-labelledby={`section-${section.id}`}>
              <h2 id={`section-${section.id}`}>{t.section[section.id]}</h2>
              <div className="grid">
                {section.fields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    lang={lang}
                    value={values[field.name]}
                    error={errors[field.name]}
                    onChange={setValue}
                  />
                ))}
              </div>
            </section>
          ))}

          <section className="card" aria-labelledby="section-declaration">
            <h2 id="section-declaration">{t.section.declaration}</h2>
            <div className="grid">
              <div className="field col-2">
                <label htmlFor="signature">{t.signature}</label>
                <input
                  id="signature"
                  className={`form-control${errors.signature ? ' has-error' : ''}`}
                  value={values.signature || ''}
                  onChange={(e) => setValue('signature', e.target.value)}
                  aria-invalid={errors.signature ? 'true' : undefined}
                />
                {errors.signature && <span className="field-error" role="alert">{errors.signature}</span>}
              </div>
              <div className="field col-2">
                <label htmlFor="formDate">{t.date}</label>
                <input
                  id="formDate"
                  type="date"
                  className="form-control"
                  value={values.formDate || today}
                  onChange={(e) => setValue('formDate', e.target.value)}
                />
              </div>
              <div className="field col-1">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={Boolean(values.agree)}
                    onChange={(e) => setValue('agree', e.target.checked)}
                    aria-invalid={errors.agree ? 'true' : undefined}
                  />
                  <span>{t.declarationText}</span>
                </label>
                {errors.agree && <span className="field-error" role="alert">{errors.agree}</span>}
              </div>
            </div>
          </section>

          <section className="card official-use no-print" aria-label={t.officialUse}>
            <h2>{t.officialUse}</h2>
            <div className="grid">
              <div className="field col-2"><label>{t.visaNo}</label><div className="blank-line" /></div>
              <div className="field col-2"><label>{t.visaTypeOfficial}</label><div className="blank-line" /></div>
              <div className="field col-2"><label>{t.approvedBy}</label><div className="blank-line" /></div>
            </div>
          </section>

          <div className="actions no-print">
            <button type="button" className="btn ghost" onClick={() => { setValues({ formDate: today }); setErrors({}) }}>{t.reset}</button>
            <button type="button" className="btn secondary" onClick={() => window.print()}>{t.print}</button>
            <button type="submit" className="btn primary" disabled={sending}>{sending ? t.submitting : t.submit}</button>
          </div>
        </form>
      </main>

      <footer className="site-footer">
        <p>{lang === 'zh' ? '本工具仅用于填写与整理申请表，确保护照信息一致；提交前请再次核对。' : 'This tool helps complete and organize the form. Verify all details against your passport before submitting.'}</p>
      </footer>

      <ConfigModal
        open={configOpen}
        t={t}
        config={config}
        onSave={handleSaveConfig}
        onClear={handleClearConfig}
        onClose={() => setConfigOpen(false)}
      />
      <ResultModal
        open={result.open}
        t={t}
        sent={result.sent}
        summary={result.summary}
        toEmail={config.toEmail}
        onCopy={handleCopy}
        onClose={() => setResult((r) => ({ ...r, open: false }))}
        onPrint={() => window.print()}
      />
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
