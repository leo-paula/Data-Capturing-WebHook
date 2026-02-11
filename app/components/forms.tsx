'use client'
import React, { useState } from 'react';

type NotificationType = "success" | "error";

interface NotificationState {
    type: NotificationType;
    title: string;
    databaseMessage: string;
    webhookMessage: string;
}

export const ContactForm: React.FC = () => {
    const initialFormData = {
        name: '',
        mail: '',
        phone: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [notification, setNotification] = useState<NotificationState | null>(
        null,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/create', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({...formData}),
            });
            const payload = await response.json();
            const webhookDone = payload?.webhook?.done === true;
            const databaseMessage =
                payload?.database?.message ?? 'Sem resposta do banco.';
            const webhookMessage =
                payload?.webhook?.message ?? 'Sem resposta do WebHook.';

            setNotification({
                type: webhookDone ? 'success' : 'error',
                title: webhookDone ? 'WebHook confirmado' : 'WebHook falhou',
                databaseMessage,
                webhookMessage,
            });

            if (response.ok && webhookDone) {
                setFormData(initialFormData);
            }
        } catch (error) {
            setNotification({
                type: 'error',
                title: 'Falha ao enviar',
                databaseMessage: 'Nao foi possivel contatar o servidor.',
                webhookMessage: 'Nao foi possivel contatar o WebHook.',
            });
        }
    };

    return (
        <>
            {notification && (
                <div
                    className={`fixed right-6 top-6 z-50 w-[320px] rounded-2xl border px-4 py-3 text-sm shadow-lg ${notification.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                        }`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-semibold">{notification.title}</p>
                            <p className="mt-2 text-xs leading-relaxed text-black/70">
                                <span className="font-semibold">Banco:</span> {notification.databaseMessage}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-black/70">
                                <span className="font-semibold">WebHook:</span> {notification.webhookMessage}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNotification(null)}
                            className="rounded-full border border-black/10 px-2 py-1 text-xs text-black/70"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="mail"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    Enviar
                </button>
            </form>
        </>
    );
};