import { Link } from 'react-router-dom';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  to,
  ...props
}) => {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link
        {...props}
        className={classes}
        to={to}
        aria-disabled={disabled || isLoading ? 'true' : undefined}
        onClick={disabled || isLoading ? (event) => event.preventDefault() : props.onClick}
      >
        {isLoading && <span className="button__spinner" aria-hidden="true" />}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className="button__spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
