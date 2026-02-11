import { Request, Response } from "express";
import OpenAI from "openai";
import { AuthRequest } from "../types";
import { sendSuccess, sendError, sendServerError } from "../utils/response";

/**
 * Client Groq (compatible SDK OpenAI)
 * Utilise Llama 3.3 70B — gratuit et performant
 * Initialisation paresseuse pour s'assurer que les variables d'env sont chargées
 */
let groq: OpenAI | null = null;

function getGroqClient(): OpenAI {
  if (!groq) {
    groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groq;
}

const SYSTEM_PROMPT = `Tu es un assistant de gestion de projet. L'utilisateur décrit des tâches à créer avec des échéances.

Réponds UNIQUEMENT avec un tableau JSON valide (sans markdown, sans commentaire).

Chaque objet doit avoir exactement ces 3 champs :
- "title" : titre court et clair (max 80 caractères)
- "description" : description concise (1-2 phrases)
- "dueDate" : date d'échéance au format YYYY-MM-DD

Génère entre 2 et 8 tâches selon la complexité.

Exemple :
[{"title":"Créer la maquette","description":"Designer les écrans principaux sur Figma.","dueDate":"2026-03-15"}]`;

/**
 * Générer des tâches via l'IA
 * POST /ai/generate-tasks
 */
export const generateTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      sendError(res, "Utilisateur non authentifié", "UNAUTHORIZED", 401);
      return;
    }

    if (!process.env.GROQ_API_KEY) {
      sendServerError(res, "Clé API Groq non configurée sur le serveur");
      return;
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      sendError(res, "Le prompt est requis", "VALIDATION_ERROR", 400);
      return;
    }

    const completion = await getGroqClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt.trim() },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      sendError(res, "L'IA n'a pas retourné de réponse", "AI_ERROR", 500);
      return;
    }

    // Parser la réponse JSON (nettoyer les éventuels ``` ajoutés par l'IA)
    const cleaned = content
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    let tasks: { title: string; description: string; dueDate: string }[];

    try {
      tasks = JSON.parse(cleaned);
    } catch {
      sendError(
        res,
        "Impossible de parser la réponse. Réessayez avec un prompt plus clair.",
        "AI_PARSE_ERROR",
        500
      );
      return;
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      sendError(
        res,
        "Aucune tâche générée. Reformulez votre demande.",
        "AI_EMPTY",
        500
      );
      return;
    }

    // Valider et nettoyer chaque tâche
    const validTasks = tasks
      .filter((t) => t?.title?.trim())
      .map((t) => ({
        title: t.title.trim(),
        description:
          typeof t.description === "string" ? t.description.trim() : "",
        dueDate:
          typeof t.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate)
            ? t.dueDate
            : "",
      }));

    if (validTasks.length === 0) {
      sendError(res, "Tâches invalides. Réessayez.", "AI_INVALID", 500);
      return;
    }

    sendSuccess(res, "Tâches générées avec succès", { tasks: validTasks });
  } catch (error: unknown) {
    console.error("Erreur génération IA:", error);

    const code = (error as { code?: string })?.code;
    const status = (error as { status?: number })?.status;

    if (code === "insufficient_quota") {
      sendError(res, "Quota Groq épuisé.", "QUOTA_EXCEEDED", 402);
      return;
    }
    if (status === 401) {
      sendError(
        res,
        "Clé API Groq invalide.",
        "INVALID_API_KEY",
        401
      );
      return;
    }
    if (status === 429) {
      sendError(
        res,
        "Trop de requêtes. Réessayez dans quelques secondes.",
        "RATE_LIMITED",
        429
      );
      return;
    }

    sendServerError(res, "Erreur lors de la génération des tâches");
  }
};
