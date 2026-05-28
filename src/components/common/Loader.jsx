const Loader = ({ label = 'Загрузка', fullPage = false }) => (
  <div className={fullPage ? 'loader loader--page' : 'loader'} role="status">
    <span className="loader__dot" />
    <span>{label}</span>
  </div>
);

export default Loader;

