declare global {
  interface Window {
    BrevoConversations?: (action: string) => void;
    BrevoConversationsID?: string;
  }
}

export {};
