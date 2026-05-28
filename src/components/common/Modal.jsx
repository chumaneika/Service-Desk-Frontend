import Button from './Button';

const Modal = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal__backdrop" type="button" aria-label="Закрыть окно" onClick={onClose} />
      <section className="modal__panel">
        <div className="modal__header">
          <h2 id="modal-title">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Закрыть
          </Button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </section>
    </div>
  );
};

export default Modal;

