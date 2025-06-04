import React from 'react';

const ComingSoonModal = ({ closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Coming Soon</h2>
        <p>This tool is not available yet. Stay tuned for updates!</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default ComingSoonModal;