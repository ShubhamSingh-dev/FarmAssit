"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { FC } from "react";

export const FloatingChat: FC = () => {
  const openTelegram = () => {
    window.open("https://t.me/FarmerAidBot", "_blank");
  };

  return (
    <Button
      onClick={openTelegram}
      className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600"
    >
      <MessageSquare className="w-5 h-5 mr-2" />
      Chat with AI
    </Button>
  );
};
