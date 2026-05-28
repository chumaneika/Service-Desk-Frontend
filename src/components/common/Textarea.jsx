const Textarea = ({ label, error, hint, className = '', id, ...props }) => {
  const textareaId = id || props.name;

  return (
    <label className={`field ${className}`} htmlFor={textareaId}>
      {label && <span className="field__label">{label}</span>}
      <textarea id={textareaId} className={`textarea ${error ? 'input--error' : ''}`} {...props} />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
};

export default Textarea;

