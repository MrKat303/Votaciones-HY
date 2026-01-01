import { Poll, VotePayload, Option } from "@/types";

// In-memory store (lossy on server restart, but works for demo)
// In a real app, this would be a database.
let activePoll: Poll | null = null;

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    createPoll: async (title: string, durationMinutes: number): Promise<Poll> => {
        await delay(300);
        const now = new Date();
        // const endTime = new Date(now.getTime() + durationMinutes * 60000);

        const newPoll: Poll = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            options: [
                { id: "a-favor", text: "A favor", votes: 0 },
                { id: "en-contra", text: "En contra", votes: 0 },
                { id: "abstencion", text: "Abstención", votes: 0 },
            ],
            startTime: now.toISOString(),
            endTime: null, // Manually closed or logic handled elsewhere
            isActive: true,
            totalVotes: 0,
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

        // Simulate "Realtime" by mutating state immediately
        option.votes += 1;
        activePoll.totalVotes += 1;

        return { success: true, message: "Voto registrado" };
    },

    // For verifying mock state
    resetSystem: async () => {
        activePoll = null;
    }
};
