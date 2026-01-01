import { Poll, VotePayload, Option } from "@/types";

// In-memory store (lossy on server restart, but works for demo)
let activePoll: Poll | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    createPoll: async (title: string, durationMinutes: number, customOptions?: string[], maxVoters: number = 100): Promise<Poll> => {
        await delay(300);
        const now = new Date();
        const endTime = new Date(now.getTime() + durationMinutes * 60000).toISOString();

        // Default options if none provided
        const optionTexts = customOptions && customOptions.length > 0
            ? customOptions
            : ["A favor", "En contra", "Abstención"];

        const newPoll: Poll = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            options: optionTexts.map((text, index) => ({
                id: `opt-${index}-${Math.random().toString(36).substr(2, 5)}`,
                text,
                votes: 0
            })),
            startTime: now.toISOString(),
            endTime: endTime,
            isActive: true,
            totalVotes: 0,
            maxVoters: maxVoters,
        };

        activePoll = newPoll;
        return newPoll;
    },

    getActivePoll: async (): Promise<Poll | null> => {
        await delay(100);
        return activePoll;
    },

    closePoll: async (): Promise<void> => {
        await delay(200);
        if (activePoll) {
            activePoll.isActive = false;
            activePoll.endTime = new Date().toISOString();
        }
    },

    vote: async (payload: VotePayload): Promise<{ success: boolean; message: string }> => {
        await delay(200);
        if (!activePoll) return { success: false, message: "No hay votación activa" };
        if (!activePoll.isActive) return { success: false, message: "La votación ha cerrado" };

        const option = activePoll.options.find((o) => o.id === payload.optionId);
        if (!option) return { success: false, message: "Opción inválida" };

        option.votes += 1;
        activePoll.totalVotes += 1;

        return { success: true, message: "Voto registrado" };
    },

    resetSystem: async () => {
        activePoll = null;
    }
};
