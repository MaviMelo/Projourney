import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MessageData {
    status: 'success' | 'error'
    msg: string;
}

interface SharedProps {
    flash: {
        message: MessageData | null;
    };
    [key: string]: any;
}

// Desestruturação do objeto 'flash' definido no middleware "HandleInertiaRequests.php" para obter apenas a propriedade "message" 
export default function MessageReturned() {

    const { flash } = usePage<SharedProps>().props;
    const message = flash?.message;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
        }
    }, [message]);

    if (!message || !show) {
        return null;
    }

    const isSuccess = message.status === 'success';

    return (

        <div
            className={`mb-4 p-4 rounded ${isSuccess
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
                }`}

            role="alert"
        >
            <span className="flex-1">{message.msg}</span>

            <button
                onClick={() => setShow(false)}
                className={`ml-4 p-1 rounded-full transition-colors ${isSuccess
                        ? 'hover:bg-green-200 text-green-600'
                        : 'hover:bg-red-200 text-red-600'
                    }`}

            >
                <X size={18} />
            </button>        </div>
    )


}