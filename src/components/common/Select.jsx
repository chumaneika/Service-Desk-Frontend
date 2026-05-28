const Select = ({ label, error, hint, options = [], className = '', id, ...props }) => {
  const selectId = id || props.name;

  return (
    <label className={`field ${className}`} htmlFor={selectId}>
      {label && <span className="field__label">{label}</span>}
      <select id={selectId} className={`select ${error ? 'input--error' : ''}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
};

export default Select;

