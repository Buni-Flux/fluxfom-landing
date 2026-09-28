import { corsHeaders, generateAiJson, json, jsonError } from "../_shared/flux-ai.ts";

type Message = { role: "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonError("Method not allowed", 405);

  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1200) : "";
    if (!message) return jsonError("A message is required", 400);

    const history = Array.isArray(body?.history)
      ? body.history
          .filter((item: unknown): item is Message =>
            Boolean(
              item &&
                typeof item === "object" &&
                ((item as Message).role === "user" || (item as Message).role === "assistant") &&
                typeof (item as Message).content === "string",
            ),
          )
          .slice(-8)
          .map((item: Message) => ({ role: item.role, content: item.content.slice(0, 1200) }))
      : [];

    const ai = await generateAiJson({
      systemPrompt:
        "You are the public FluxFom brand and marketing services assistant. Help prospective clients understand FluxFom, its services, process, and next steps before they commit. Be warm, concise, and answer in plain language, usually under 120 words. Only state facts supported by the conversation or the public website context; do not invent prices, guarantees, timelines, or service details. If you do not know, say so and suggest contacting the team at /contact. Return JSON with one string field named reply.",
      userPrompt: JSON.stringify({ conversation: [...history, { role: "user", content: message }] }),
      fallback: {
        reply: "I can help you explore FluxFom's services and what to expect. What are you hoping to build or improve? For specific project details, our team can help at /contact.",
      },
    });

    const reply = typeof ai.output.reply === "string" ? ai.output.reply : "I couldn't prepare an answer just now. Please try again or contact our team at /contact.";
    return json({ reply });
  } catch {
    return jsonError("Unable to process your message", 400);
  }
});