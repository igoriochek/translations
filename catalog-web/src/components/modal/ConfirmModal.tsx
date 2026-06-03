import Modal from './Modal';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;

    confirmText?: string;
    cancelText?: string;

    loading?: boolean;

    onConfirm: () => void;
    onClose: () => void;
}

export default function ConfirmModal({
                                         open,
                                         title,
                                         message,

                                         confirmText = 'Confirm',
                                         cancelText = 'Cancel',

                                         loading = false,

                                         onConfirm,
                                         onClose
                                     }: ConfirmModalProps) {

    return (
        <Modal
            open={open}
            title={title}
            onClose={onClose}
        >

            <div className="space-y-6">

                <p className="text-zinc-600 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="
                            px-4 py-2
                            rounded-lg
                            border border-zinc-300
                            hover:bg-zinc-100
                            disabled:opacity-50
                        "
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            px-4 py-2
                            rounded-lg
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? 'Processing...'
                            : confirmText}
                    </button>

                </div>

            </div>

        </Modal>
    );
}