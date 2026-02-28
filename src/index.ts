import { serve, plugin } from "bun";
import tailwind from "bun-plugin-tailwind";

plugin(tailwind);

import index from "./index.html";
import {
  handleAssistantGuidance,
  handleProactiveHelp,
  handleDocumentAnalysis,
  handlePosterGeneration,
  handleTTS,
  resetServerChatSession,
} from "./server/gemini";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes
    "/*": index,

    // --- Gemini AI Proxy Routes ---
    // API keys stay server-side; frontend calls these via fetch.

    "/api/assistant": {
      async POST(req) {
        try {
          const body = await req.json();
          const result = await handleAssistantGuidance(body);
          return Response.json(result);
        } catch (err: any) {
          console.error("[/api/assistant]", err);
          return Response.json({ text: "" }, { status: 500 });
        }
      },
    },

    "/api/proactive": {
      async POST(req) {
        try {
          const body = await req.json();
          const result = await handleProactiveHelp(body);
          return Response.json(result);
        } catch (err: any) {
          console.error("[/api/proactive]", err);
          return Response.json({ text: "" }, { status: 500 });
        }
      },
    },

    "/api/analyze-document": {
      async POST(req) {
        try {
          const body = await req.json();
          const result = await handleDocumentAnalysis(body);
          return Response.json(result);
        } catch (err: any) {
          console.error("[/api/analyze-document]", err);
          return Response.json({ text: "Analysis failed." }, { status: 500 });
        }
      },
    },

    "/api/generate-poster": {
      async POST(req) {
        try {
          const body = await req.json();
          const result = await handlePosterGeneration(body);
          return Response.json(result);
        } catch (err: any) {
          console.error("[/api/generate-poster]", err);
          return Response.json({ imageData: null }, { status: 500 });
        }
      },
    },

    "/api/tts": {
      async POST(req) {
        try {
          const body = await req.json();
          const result = await handleTTS(body);
          return Response.json(result);
        } catch (err: any) {
          console.error("[/api/tts]", err);
          return Response.json({ audioData: null }, { status: 500 });
        }
      },
    },

    "/api/reset-session": {
      async POST() {
        resetServerChatSession();
        return Response.json({ ok: true });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
