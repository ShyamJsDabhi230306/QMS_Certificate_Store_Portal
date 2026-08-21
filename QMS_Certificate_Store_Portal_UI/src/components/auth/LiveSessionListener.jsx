import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../../Config/BaseUrl";

const LiveSessionListener = () => {
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return undefined;
        }

        let disposed = false;

        const apiOrigin = new URL(API_URL).origin;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiOrigin}/hubs/session`, {
                accessTokenFactory: () =>
                    localStorage.getItem("token") || "",
                withCredentials: true,
            })
            .withAutomaticReconnect([
                0,
                2000,
                5000,
                10000,
                30000,
            ])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        const logoutUser = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userRights");
            localStorage.removeItem("auth");

            window.location.replace("/login");
        };

        connection.on("sessionEnded", logoutUser);

        connection.onreconnecting((error) => {
            console.warn(
                "Aira live-session reconnecting:",
                error?.message
            );
        });

        connection.onreconnected(() => {
            console.info(
                "Aira live-session reconnected."
            );
        });

        connection.onclose((error) => {
            if (!disposed && error) {
                console.error(
                    "Aira live-session closed:",
                    error
                );
            }
        });

        // Delaying start prevents React StrictMode's temporary
        // first mount from starting and immediately stopping negotiation.
        const startTimer = window.setTimeout(async () => {
            if (disposed) {
                return;
            }

            try {
                await connection.start();

                if (!disposed) {
                    console.info(
                        "Aira live-session connection established."
                    );
                }
            } catch (error) {
                if (
                    !disposed &&
                    error?.name !== "AbortError"
                ) {
                    console.error(
                        "Aira live-session connection failed:",
                        error
                    );
                }
            }
        }, 0);

        return () => {
            disposed = true;

            window.clearTimeout(startTimer);

            connection.off("sessionEnded", logoutUser);

            if (
                connection.state !==
                signalR.HubConnectionState.Disconnected
            ) {
                connection.stop().catch(() => {
                    // Expected if cleanup occurs during negotiation.
                });
            }
        };
    }, []);

    return null;
};

export default LiveSessionListener;