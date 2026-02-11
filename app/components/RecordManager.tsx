'use client'
import React, { useState } from "react";
import { Record } from "./record";
import { useRouter } from "next/navigation";

interface IncomingRecord {
    id?: string | number;
    name: string;
    mail: string;
    phone: string;
}

interface RecordManagerProps {
    initialRecords: IncomingRecord[];
}

type NotificationType = "success" | "error";

interface NotificationState {
    type: NotificationType;
    title: string;
    databaseMessage: string;
    webhookMessage: string;
}

const chunkRecords = (records: IncomingRecord[], size: number) => {
    const chunks: IncomingRecord[][] = [];
    for (let index = 0; index < records.length; index += size) {
        chunks.push(records.slice(index, index + size));
    }
    return chunks;
};

export const RecordManager: React.FC<RecordManagerProps> = ({ initialRecords }) => {
    const [records, setRecords] = useState<IncomingRecord[]>(initialRecords);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const router = useRouter();

    const handleSave = async (oldRecord: IncomingRecord, newValues: { name: string; mail: string; phone: string }) => {
        try {
            const response = await fetch('http://localhost:3000/api/edit', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        id: oldRecord.id,
                        name: oldRecord.name,
                        mail: oldRecord.mail,
                        phone: oldRecord.phone,
                    },
                    new_values: newValues
                }),
            });
            const payload = await response.json();
            const webhookDone = payload?.webhook?.done === true;
            const databaseMessage = payload?.database?.message ?? 'Sem resposta do banco.';
            const webhookMessage = payload?.webhook?.message ?? 'Sem resposta do WebHook.';

            setNotification({
                type: webhookDone ? 'success' : 'error',
                title: webhookDone ? 'Editado com sucesso' : 'WebHook falhou',
                databaseMessage,
                webhookMessage,
            });

            if (response.ok && webhookDone) {
                // Update local state to reflect changes
                setRecords(prev => prev.map(record => 
                    record.id === oldRecord.id
                        ? { ...record, ...newValues }
                        : record
                ));
                router.refresh();
            }
        } catch (error) {
            setNotification({
                type: 'error',
                title: 'Falha ao editar',
                databaseMessage: 'Não foi possível contatar o servidor.',
                webhookMessage: 'Não foi possível contatar o WebHook.',
            });
        }
    };

    const handleDelete = async (record: IncomingRecord) => {
        try {
            const response = await fetch('http://localhost:3000/api/delete', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: record.id,
                    name: record.name,
                    mail: record.mail,
                    phone: record.phone,
                }),
            });
            const payload = await response.json();
            const webhookDone = payload?.webhook?.done === true;
            const databaseMessage = payload?.database?.message ?? 'Sem resposta do banco.';
            const webhookMessage = payload?.webhook?.message ?? 'Sem resposta do WebHook.';

            setNotification({
                type: webhookDone ? 'success' : 'error',
                title: webhookDone ? 'Removido com sucesso' : 'WebHook falhou',
                databaseMessage,
                webhookMessage,
            });

            if (response.ok && webhookDone) {
                // Remove from local state
                setRecords(prev => prev.filter(r => r.id !== record.id));
                router.refresh();
            }
        } catch (error) {
            setNotification({
                type: 'error',
                title: 'Falha ao remover',
                databaseMessage: 'Não foi possível contatar o servidor.',
                webhookMessage: 'Não foi possível contatar o WebHook.',
            });
        }
    };

    const recordBatches = chunkRecords(records, 3);

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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-black/50">
                        Gerenciar
                    </p>
                    <h2 className="text-2xl font-semibold">Seus registros</h2>
                </div>
                <span className="text-sm text-black/60">
                    Total: {records.length}
                </span>
            </div>
            <div>
                {recordBatches.map((batch, batchIndex) => (
                    <div
                        key={`row-${batchIndex}`}
                        style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
                    >
                        {batch.map((record, index) => (
                            <Record
                                key={record.id ?? record.mail ?? `${batchIndex}-${index}`}
                                name={record.name}
                                mail={record.mail}
                                phone={record.phone}
                                onSave={(newValues) => handleSave(record, newValues)}
                                onDelete={() => handleDelete(record)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};
