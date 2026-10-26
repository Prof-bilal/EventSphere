import { useEffect } from 'react'

function messageFor(control) {
  if (control.validity.valueMissing) return 'This field is required.'
  if (control.validity.tooShort) return `Enter at least ${control.minLength} characters.`
  if (control.validity.typeMismatch) {
    if (control.type === 'email') return 'Enter a valid email address.'
    if (control.type === 'url') return 'Enter a valid URL.'
    return 'Enter a valid value.'
  }
  if (control.validity.patternMismatch) return 'Use the requested format.'
  if (control.validity.rangeUnderflow) return `Use a value of at least ${control.min}.`
  if (control.validity.rangeOverflow) return `Use a value no greater than ${control.max}.`
  return control.validationMessage || 'Enter a valid value.'
}

function fieldContainer(control) {
  return (
    control.closest('label, .workspace-field, .contact-form > div, .review-actions') ||
    control.parentElement
  )
}

function validateForm(form, state, revealErrors = false) {
  const controls = [...form.querySelectorAll('input, select, textarea')].filter(
    (control) => !control.disabled && control.type !== 'button' && control.type !== 'submit',
  )
  let valid = true

  controls.forEach((control) => {
    const controlValid = control.checkValidity()
    if (!controlValid) valid = false
    const container = fieldContainer(control)
    if (!container) return

    let error = container.querySelector(`.live-form-error[data-for="${control.name || control.id}"]`)
    const key = control.name || control.id
    if (!error && key) {
      error = document.createElement('small')
      error.className = 'live-form-error'
      error.dataset.for = key
      container.appendChild(error)
    }
    if (error) {
      const show = !controlValid && (revealErrors || state.touched.has(control))
      const nextMessage = show ? messageFor(control) : ''
      if (error.textContent !== nextMessage) error.textContent = nextMessage
      error.hidden = !show
    }
    control.setAttribute('aria-invalid', !controlValid && (revealErrors || state.touched.has(control)))
  })

  form.querySelectorAll('button[type="submit"], button:not([type])').forEach((button) => {
    if (button.disabled && !button.dataset.liveValidationDisabled && valid) return
    if (!valid) {
      button.disabled = true
      button.dataset.liveValidationDisabled = 'true'
    } else if (button.dataset.liveValidationDisabled) {
      button.disabled = false
      delete button.dataset.liveValidationDisabled
    }
  })
  return valid
}

export default function LiveFormValidation() {
  useEffect(() => {
    const forms = new Map()

    function attach(form) {
      if (forms.has(form) || form.closest('.auth-page')) return
      form.noValidate = true
      const state = { touched: new WeakSet() }
      const onInput = (event) => {
        if (event.target.matches('input, select, textarea')) state.touched.add(event.target)
        validateForm(form, state)
      }
      const onSubmit = (event) => {
        const valid = validateForm(form, state, true)
        if (!valid) event.preventDefault()
      }
      form.addEventListener('input', onInput)
      form.addEventListener('change', onInput)
      form.addEventListener('submit', onSubmit, true)
      forms.set(form, { state, onInput, onSubmit })
      validateForm(form, state)
    }

    function scan() {
      document.querySelectorAll('form').forEach(attach)
      forms.forEach(({ state }, form) => validateForm(form, state))
    }

    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true })
    scan()

    return () => {
      observer.disconnect()
      forms.forEach(({ onInput, onSubmit }, form) => {
        form.removeEventListener('input', onInput)
        form.removeEventListener('change', onInput)
        form.removeEventListener('submit', onSubmit, true)
      })
      forms.clear()
    }
  }, [])

  return null
}
