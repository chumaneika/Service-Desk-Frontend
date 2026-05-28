const Input = ({ label, error, hint, className = '', id, ...props }) => {
  const inputId = id || props.name;

  return (
    <label className={`field ${className}`} htmlFor={inputId}>
      {label && <span className="field__label">{label}</span>}
      <input id={inputId} className={`input ${error ? 'input--error' : ''}`} {...props} />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
};

export default Input;

