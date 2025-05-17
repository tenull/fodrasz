const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }} onClick={onClose}>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={{ float: 'right' }}>X</button>
          {children}
        </div>
      </div>
    );
  };
  export default Modal