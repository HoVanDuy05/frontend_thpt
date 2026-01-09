"use client";

import React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    React.useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
                    <h1>Something went wrong!</h1>
                    <p>
                        <b>Error:</b> {error.message}
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: "10px 20px",
                            background: "#333",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
