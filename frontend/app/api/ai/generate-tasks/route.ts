import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * POST /api/ai/generate-tasks
 *
 * Reçoit un prompt et retourne des tâches générées par IA (Groq / Llama 3).
 * Chaque tâche contient : title, description, dueDate (format YYYY-MM-DD).
 */

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `Tu es un assistant de gestion de projet. L'utilisateur décrit des tâches à créer avec des échéances.

Réponds UNIQUEMENT avec un tableau JSON valide (sans markdown, sans commentaire).

Chaque objet doit avoir exactement ces 3 champs :
- "title" : titre court et clair (max 80 caractères)
- "description" : description concise (1-2 phrases)
- "dueDate" : date d'échéance au format YYYY-MM-DD

Génère entre 2 et 8 tâches selon la complexité.

Exemple :
[{"title":"Créer la maquette","description":"Designer les écrans principaux sur Figma.","dueDate":"2026-03-15"}]`;

export async function POST(request: NextRequest) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'Clé API Groq non configurée. Ajoutez GROQ_API_KEY dans .env' },
                { status: 500 }
            );
        }

        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return NextResponse.json({ error: 'Le prompt est requis' }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt.trim() },
            ],
            temperature: 0.7,
        });

        const content = completion.choices[0]?.message?.content?.trim();

        if (!content) {
            return NextResponse.json({ error: "L'IA n'a pas retourné de réponse" }, { status: 500 });
        }

        // Parser la réponse JSON (nettoyer les éventuels ``` ajoutés par l'IA)
        const cleaned = content.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
        let tasks: { title: string; description: string; dueDate: string }[];

        try {
            tasks = JSON.parse(cleaned);
        } catch {
            return NextResponse.json(
                { error: "Impossible de parser la réponse. Réessayez avec un prompt plus clair." },
                { status: 500 }
            );
        }

        if (!Array.isArray(tasks) || tasks.length === 0) {
            return NextResponse.json({ error: "Aucune tâche générée. Reformulez votre demande." }, { status: 500 });
        }

        // Valider et nettoyer chaque tâche
        const validTasks = tasks
            .filter(t => t?.title?.trim())
            .map(t => ({
                title: t.title.trim(),
                description: typeof t.description === 'string' ? t.description.trim() : '',
                dueDate: typeof t.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate) ? t.dueDate : '',
            }));

        if (validTasks.length === 0) {
            return NextResponse.json({ error: "Tâches invalides. Réessayez." }, { status: 500 });
        }

        return NextResponse.json({ tasks: validTasks });
    } catch (error: unknown) {
        console.error('Erreur génération IA:', error);

        const code = (error as { code?: string })?.code;
        const status = (error as { status?: number })?.status;

        if (code === 'insufficient_quota') {
            return NextResponse.json({ error: 'Quota Groq épuisé.' }, { status: 402 });
        }
        if (status === 401) {
            return NextResponse.json({ error: 'Clé API Groq invalide. Vérifiez GROQ_API_KEY dans .env' }, { status: 401 });
        }
        if (status === 429) {
            return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 });
        }

        return NextResponse.json({ error: 'Erreur lors de la génération des tâches' }, { status: 500 });
    }
}
