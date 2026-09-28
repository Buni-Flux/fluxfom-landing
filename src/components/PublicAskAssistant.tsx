import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What can FluxFom help my business with?",
  "How does the process work?",
  "How do I get started?",
];

const PublicAskAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, isOpen]);

  const sendMessage = async (event?: FormEvent<HTMLFormElement>, question = draft) => {
    event?.preventDefault();
    const content = question.trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setDraft("");
    setIsOpen(true);
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("public-ask-assistant", {
        body: {
          message: content,
          history: messages.slice(-8),
        },
      });

      if (error) throw error;
      const reply = typeof data?.reply === "string" ? data.reply : "I couldn't prepare an answer just now. Please try again or contact our team.";
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I can't reach the assistant right now. You can still talk with our team at /contact.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[1200] flex w-[min(690px,calc(100vw-2rem))] -translate-x-1/2 flex-col items-end gap-3 sm:bottom-6">
      {isOpen && (
        <section
          aria-label="FluxFom AI Assistant"
          className="flex h-[min(560px,calc(100dvh-7rem))] w-full flex-col overflow-hidden rounded-2xl border border-[#dce6dc] bg-[#fbfcf8] text-[#17251b] shadow-[0_18px_70px_rgba(0,0,0,0.28)]"
        >
          <header className="flex items-center justify-between border-b border-[#e5ebe2] bg-[#f5f8f1] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfff71] text-[#18321a]">
                <Sparkles size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold">FluxFom Assistant</p>
                <p className="text-xs text-[#687469]">Here to help you decide</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#59645a] transition hover:bg-[#e9eee5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a8f36]"
            >
              <X size={17} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="pt-2">
                <p className="max-w-[290px] text-[17px] font-semibold leading-snug">What would you like to know before getting started?</p>
                <p className="mt-2 text-sm leading-relaxed text-[#687469]">Ask about our services, process, or finding the right next step for your brand.</p>
                <div className="mt-5 flex flex-col items-start gap-2">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void sendMessage(undefined, question)}
                      className="rounded-lg border border-[#dce6dc] bg-white px-3 py-2 text-left text-xs text-[#374539] transition hover:border-[#79a96b] hover:bg-[#f6faef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a8f36]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "ml-auto bg-[#183b20] text-white"
                      : "mr-auto border border-[#e5ebe2] bg-white text-[#28342b]"
                  }`}
                >
                  {message.content.split(/(\/contact)/g).map((part, partIndex) =>
                    part === "/contact" ? (
                      <Link key={partIndex} to="/contact" className="font-medium underline underline-offset-2">
                        Talk to our team
                      </Link>
                    ) : (
                      part
                    ),
                  )}
                </div>
              ))
            )}
            {isSending && <p className="text-xs text-[#687469]">Thinking…</p>}
          </div>

          <form onSubmit={(event) => void sendMessage(event)} className="border-t border-[#e5ebe2] bg-white p-3">
            <label htmlFor="public-assistant-message" className="sr-only">Ask the FluxFom Assistant</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#dce6dc] bg-[#f8faf6] px-3 py-2 focus-within:border-[#7aaa6c] focus-within:ring-2 focus-within:ring-[#7aaa6c]/20">
              <input
                id="public-assistant-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask anything about FluxFom"
                maxLength={1200}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#17251b] outline-none placeholder:text-[#788277]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                aria-label="Send message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dfff71] text-[#18321a] transition hover:bg-[#d3f45e] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </section>
      )}

      {!isOpen && (
        <form onSubmit={(event) => void sendMessage(event)} className="flex h-[58px] w-full items-center gap-3 rounded-[20px] border border-[#e2e9e2] bg-[#f8fafc] px-4 shadow-[0_8px_32px_rgba(0,0,0,0.16)] ring-1 ring-white/70 sm:h-[64px] sm:px-5">
          <label htmlFor="public-assistant-prompt" className="sr-only">Ask the FluxFom Assistant</label>
          <input
            id="public-assistant-prompt"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask anything about FluxFom"
            maxLength={1200}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#344338] outline-none placeholder:text-[#53665a] sm:text-base"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6c7770] transition hover:bg-[#e8eee7] hover:text-[#26382b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={19} fill="currentColor" strokeWidth={1.3} />
          </button>
        </form>
      )}
    </div>
  );
};

export default PublicAskAssistant;