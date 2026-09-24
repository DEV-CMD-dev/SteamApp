import React, { useEffect, useState, useContext, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { chatService } from "../services/chatService";
import { profileService } from "../services/profileService";
import { decodeUserIdFromToken } from "../utils/jwt";
import no_read_icon from "../assets/chat/no_read.png"
import read_white from "../assets/chat/read_white.png"



import type { MessageDto } from "../DTOs/MessageDto";
import type { PaginatedList } from "../DTOs/PaginatedList";
import type { FriendProfileDto } from "../DTOs/Profile/FriendProfileDto";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";


import "../css/Chat/chatPage.css";



type CompareDatesProps = {
    first_date: Date | string;
    second_date?: Date | string;
};

function formatMessageTime(dateString?: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function formatMessageDate({ first_date, second_date = new Date() }: CompareDatesProps): string {
    const msgDate = new Date(first_date);
    const today = new Date(second_date);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return msgDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: msgDate.getFullYear() === today.getFullYear() ? undefined : "numeric"
    });
}


export default function ChatPage() {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const recipientId = searchParams.get("userId");

    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [friends, setFriends] = useState<PaginatedList<FriendProfileDto>>();
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [value, setValue] = useState<string>("");
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const activeUser = useRef<string | null>(null);

    const fetchInitialData = async (accessToken: string) => {
        try {
            const userId = decodeUserIdFromToken(accessToken);
            if (userId) {
                const profileData = await profileService.getProfile(userId);
                setProfile(profileData);
            }

            const friendsData = await profileService.GetFriends(undefined, undefined, 50);
            setFriends(friendsData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || !connection || !recipientId) return;

        try {
            await connection.invoke("SendMessage", recipientId, value);
            setValue("");
        } catch (error) {
            console.error(error);
        }
    };

    const readMessages = async (recipientId: string) => {
        try {
            if (!connection) return;
            await connection.invoke("ReadMessage", recipientId);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (recipientId: string) => {
        try {
            const messagesData = await chatService.getMessages(recipientId, 1, 50);
            if (recipientId)
                setMessages(messagesData.items?.reverse() || []);
            console.log(messagesData.items)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!accessToken) return;

        fetchInitialData(accessToken);

        const newConnection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7166/chat`, { accessTokenFactory: () => accessToken })
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (data: MessageDto) => {
            const currentActiveChat = activeUser.current;
            if (currentActiveChat === data.senderId || currentActiveChat === data.receiverId) {
                setMessages((prev) => {
                    if (prev.some((msg) => msg.id === data.id)) return prev;
                    return [...prev, data];
                });
            }
            if (currentActiveChat === data.senderId) {
                newConnection.invoke("ReadMessage", data.senderId).catch(console.error);
            }
        });

        newConnection.on("UserConnected", (connectedUserId: string) => {
            setFriends((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((frnd) => frnd.userId === connectedUserId ? { ...frnd, isOnline: true } : frnd)
                }
            })
        })

        newConnection.on("UserDisconnected", (disconnectedUserId: string) => {
            setFriends((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.map((frnd) => frnd.userId === disconnectedUserId ? { ...frnd, isOnline: false } : frnd)
                }
            })
        });

        newConnection.on("MessagesWereRead", (readerId: string) => {
            setMessages((prev) => {
                if (!prev) return [];
                return prev.map((msg) =>
                    msg.senderId !== readerId ? { ...msg, isRead: true } : msg
                );
            });
        });

        newConnection.start()
            .then(() => setConnection(newConnection))
            .catch((err) => console.error(err));

        return () => {
            newConnection.stop();
        };
    }, [accessToken]);

    useEffect(() => {
        if (!recipientId) return
        fetchMessages(recipientId);
        activeUser.current = recipientId;
        if (connection) {
            readMessages(recipientId);
        }
    }, [recipientId, connection])


    return (
        <div className="chat-page-container">
            <div className="chats-list-container">
                <div className="my-account-card">
                    <div className="square-avatar-wrap">
                        <img
                            src={profile?.avatar ?? "https://via.placeholder.com/150"}
                            alt="My Avatar"
                            className="square-avatar"
                        />
                        <span className="online-indicator"></span>
                    </div>
                    <div className="my-account-info">
                        <span className="my-account-name">{profile?.userName ?? "Завантаження..."}</span>
                        <span className="my-account-status">Online</span>
                    </div>
                </div>

                <div className="chat-search-wrap">
                    <input type="text" placeholder="Пошук діалогів..." className="chat-search-input" />
                </div>

                <div className="chat-dialogs-list">
                    {friends?.items.map((frnd) => {
                        const isActive = recipientId === frnd.userId;

                        return (
                            <div
                                key={frnd.userId}
                                onClick={() => {
                                    if (recipientId != frnd.userId) {
                                        setMessages([])
                                        navigate(`/chat?userId=${frnd.userId}`);
                                    }
                                }}
                                className={`chat-dialog-item ${isActive ? "active" : ""}`}
                            >
                                <div className="square-avatar-wrap">
                                    <img
                                        src={frnd?.avatar ?? "https://via.placeholder.com/150"}
                                        alt={frnd?.name}
                                        className="square-avatar"
                                    />
                                    {frnd.isOnline && <span className="online-indicator"></span>}
                                </div>
                                <div className="chat-dialog-content">
                                    <div className="chat-dialog-header">
                                        <span className="dialog-user-name">{frnd?.name}</span>
                                        <span className="dialog-timestamp">16:44</span>
                                    </div>
                                    <div className="chat-dialog-footer">
                                        <p className="dialog-last-message">Останнє повідомлення</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="dialog-container">
                <div className="message-list">
                    {messages.map((message, index) => {
                        const currentDate = message.createdAt.slice(0, 10);
                        const prevDate = index > 0 ? messages[index - 1].createdAt.slice(0, 10) : null;
                        const showDivider = currentDate !== prevDate;
                        const isSender = message.receiverId === recipientId;

                        return (
                            <React.Fragment key={message.id || index}>
                                {showDivider && (
                                    <div className="date-divider">
                                        {formatMessageDate({ first_date: message.createdAt })}
                                    </div>
                                )}
                                <div className="message-container">
                                    <div className={`${isSender ? "sender" : "receiver"}-message-container`}>
                                        <span className="message-text">{message.text}</span>
                                        {isSender && (
                                            <span className="image_container_message">
                                                <img src={message.isRead ? read_white : no_read_icon}></img>
                                            </span>
                                        )}
                                        <span className="createdAt-text">
                                            {formatMessageTime(message.createdAt)}
                                        </span>
                                    </div>


                                </div>
                            </React.Fragment>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="inputs-container">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <input
                            className="input-text"
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Написати повідомлення..."
                        />
                        <button className="send-btn" type="submit" disabled={!value.trim()}></button>
                    </form>
                </div>
            </div>
        </div>
    );
}