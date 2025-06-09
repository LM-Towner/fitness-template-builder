import { CustomExerciseForm } from './CustomExerciseForm';

interface AddCustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCustomExerciseModal({ isOpen, onClose }: AddCustomExerciseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Add Custom Exercise
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <CustomExerciseForm
          onSuccess={() => {
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
} 