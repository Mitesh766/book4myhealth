import { Modal } from "./Modal";

export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  title: string;
  message: string;
  isPending?: boolean;
}> = ({ isOpen, setIsOpen, onConfirm, title, message, isPending }) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="space-y-6">
        <p className="text-gray-300">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 cursor-pointer rounded-lg transition-colors ${"bg-red-600 hover:bg-red-700 text-white"}`}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 inline-block border-2 border-t-transparent rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              <>Confirm</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
