import toast from 'react-hot-toast';
import CustomToast from '../components/ui/CustomToast';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

/**
 * Triggers a custom toast notification.
 * @param {Object} options - Toast options.
 * @param {string} options.title - The title of the toast.
 * @param {string} options.description - The description/message of the toast.
 * @param {number} [options.timeout=3000] - Duration in ms before auto-dismiss.
 * @param {boolean} [options.shouldShowTimeoutProgress=true] - Whether to show the progress bar.
 * @param {string} [options.type='default'] - Type of toast: 'success', 'error', 'default'.
 */
export const addToast = ({
  title,
  description,
  timeout = 3000,
  shouldShowTimeoutProgress = true,
  type = 'default'
}) => {
  let icon = null;
  if (type === 'success') {
      icon = <FaCheckCircle className="h-6 w-6 text-green-500" />;
  } else if (type === 'error') {
       icon = <FaExclamationCircle className="h-6 w-6 text-red-500" />;
  }

  toast.custom(
    (t) => (
      <CustomToast
        t={t}
        title={title}
        description={description}
        timeout={timeout}
        shouldShowTimeoutProgress={shouldShowTimeoutProgress}
        icon={icon}
      />
    ),
    {
      duration: timeout,
      position: 'bottom-right',
    }
  );
};
