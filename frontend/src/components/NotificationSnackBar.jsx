import React, { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NotificationSnackbar = ({ open, message, severity = 'success', onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      text: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      text: 'text-red-800'
    },
    warning: {
      bg: 'bg-orange-50 border-orange-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-orange-600',
      text: 'text-orange-800'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600',
      text: 'text-blue-800'
    }
  };

  const style = styles[severity] || styles.success;
  const Icon = style.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Transition
        show={open}
        enter="transform transition duration-300 ease-out"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform transition duration-200 ease-in"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
      >
        <div className={`${style.bg} border rounded-lg shadow-lg p-4 flex items-center max-w-sm`}>
          <Icon className={`h-5 w-5 ${style.iconColor} mr-3 flex-shrink-0`} />
          <p className={`text-sm font-medium ${style.text} flex-1`}>{message}</p>
          <button
            onClick={onClose}
            className={`ml-3 ${style.iconColor} hover:opacity-70 transition`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default NotificationSnackbar;