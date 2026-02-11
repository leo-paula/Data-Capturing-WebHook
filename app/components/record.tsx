'use client'
import React, { useState } from "react";

interface RecordProps {
    name: string;
    mail: string;
    phone: string;
    onSave?: (next: { name: string; mail: string; phone: string }) => void;
    onDelete?: () => void;
}

export const Record: React.FC<RecordProps> = ({
    name,
    mail,
    phone,
    onSave,
    onDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState({ name, mail, phone });

    const handleSave = () => {
        onSave?.(draft);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraft({ name, mail, phone });
        setIsEditing(false);
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                width: "300px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ marginTop: 0 }}>Registro</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                background: "white",
                                cursor: "pointer",
                            }}
                        >
                            Editar
                        </button>
                    )}
                    <button
                        type="button"
                        aria-label="Excluir registro"
                        onClick={onDelete}
                        style={{
                            border: "1px solid #f0caca",
                            borderRadius: "6px",
                            padding: "4px",
                            background: "white",
                            cursor: "pointer",
                            color: "#c03333",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM6 9h2v9H6V9z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label
                    style={{ display: "block", marginBottom: "4px", fontWeight: 700 }}
                >
                    Nome
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(e) =>
                            setDraft((prev) => ({ ...prev, name: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                ) : (
                    <div>{name}</div>
                )}
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label
                    style={{ display: "block", marginBottom: "4px", fontWeight: 700 }}
                >
                    Email
                </label>
                {isEditing ? (
                    <input
                        type="email"
                        value={draft.mail}
                        onChange={(e) =>
                            setDraft((prev) => ({ ...prev, mail: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                ) : (
                    <div>{mail}</div>
                )}
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label
                    style={{ display: "block", marginBottom: "4px", fontWeight: 700 }}
                >
                    Telefone
                </label>
                {isEditing ? (
                    <input
                        type="tel"
                        value={draft.phone}
                        onChange={(e) =>
                            setDraft((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                ) : (
                    <div>{phone}</div>
                )}
            </div>

            {isEditing && (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{
                            border: "1px solid #c7ddc7",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            background: "#ecf7ec",
                            cursor: "pointer",
                        }}
                    >
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            background: "white",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};
