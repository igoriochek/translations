import type {ReactNode} from 'react';

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({
                                  open,
                                  title,
                                  onClose,
                                  children
                              }: ModalProps) {

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed inset-0
                bg-black/40
                flex items-center justify-center
                z-50
            "
        >

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow-xl
                    w-full
                    max-w-2xl
                    p-6
                "
            >

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-zinc-500
                            hover:text-black
                            text-lg
                        "
                    >
                        ✕
                    </button>

                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "50em" }}>
                    {children}
                </div>
            </div>

        </div>
    );
}