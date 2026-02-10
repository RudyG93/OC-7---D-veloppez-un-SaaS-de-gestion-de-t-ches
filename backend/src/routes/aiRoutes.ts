import { Router } from "express";
import { generateTasks } from "../controllers/aiController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

/**
 * @route   POST /ai/generate-tasks
 * @desc    Générer des tâches via l'IA (Groq / Llama 3)
 * @access  Private (nécessite un token JWT valide)
 * @header  Authorization: Bearer <token>
 * @body    { prompt: string }
 */
router.post("/generate-tasks", authenticateToken, generateTasks);

export default router;
