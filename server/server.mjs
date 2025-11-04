import express from "express";
import cors from "cors";
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { mentorPrompt } from "./prompts/mentorPrompt.js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const model = new ChatOllama({ model: "llama3.2" });

// Non-streaming endpoint (simple)
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body ?? {};
    if (!question) return res.status(400).json({ error: "Missing 'question'" });

    // Build chain: prompt -> model -> text
    const chain = mentorPrompt.pipe(model).pipe(new StringOutputParser());
    const answer = await chain.invoke({ question });

    res.json({ answer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "LLM error" });
  }
});

// Optional: streaming endpoint
app.post("/chat/stream", async (req, res) => {
  try {
    const { question } = req.body ?? {};
    if (!question) return res.status(400).send("Missing 'question'");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders?.();

    // format messages from the prompt, then stream the model
    const messages = await mentorPrompt.formatMessages({ question });
    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const text = typeof chunk.content === "string"
        ? chunk.content
        : Array.isArray(chunk.content)
        ? chunk.content.map(p => (typeof p === "string" ? p : p?.text ?? "")).join("")
        : "";
      res.write(text);
    }
    res.end();
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).send("LLM error");
    else res.end();
  }
});

app.listen(8000, () => console.log("Server running on :8000"));