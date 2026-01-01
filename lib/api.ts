import { Poll, VotePayload, Option, PollType, WordVote } from "@/types";
import { supabase } from "./supabase";

export const api = {
    getPolls: async (): Promise<Poll[]> => {
        const { data, error } = await supabase
            .from('polls')
            .select(`
                *,
                poll_options (*),
                poll_word_votes (*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching polls:", error);
            return [];
        }

        return data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type as PollType,
            status: p.status,
            startTime: p.start_time,
            endTime: p.end_time,
            maxVoters: p.max_voters,
            totalVotes: p.total_votes,
            settings: {
                hideResults: p.hide_results,
                allowEdit: p.allow_edit
            },
            options: p.poll_options.map((o: any) => ({
                id: o.id,
                text: o.text,
                votes: o.votes,
                color: o.color
            })),
            wordVotes: p.poll_word_votes.map((wv: any) => ({
                text: wv.text,
                count: wv.count
            }))
        }));
    },

    getPollById: async (id: string): Promise<Poll | null> => {
        const { data, error } = await supabase
            .from('polls')
            .select(`
                *,
                poll_options (*),
                poll_word_votes (*)
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            title: data.title,
            type: data.type as PollType,
            status: data.status,
            startTime: data.start_time,
            endTime: data.end_time,
            maxVoters: data.max_voters,
            totalVotes: data.total_votes,
            settings: {
                hideResults: data.hide_results,
                allowEdit: data.allow_edit
            },
            options: data.poll_options.map((o: any) => ({
                id: o.id,
                text: o.text,
                votes: o.votes,
                color: o.color
            })),
            wordVotes: data.poll_word_votes.map((wv: any) => ({
                text: wv.text,
                count: wv.count
            }))
        };
    },

    getActivePolls: async (): Promise<Poll[]> => {
        const { data, error } = await supabase
            .from('polls')
            .select(`
                *,
                poll_options (*),
                poll_word_votes (*)
            `)
            .eq('status', 'ACTIVE');

        if (error) return [];

        return data.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type as PollType,
            status: p.status,
            startTime: p.start_time,
            endTime: p.end_time,
            maxVoters: p.max_voters,
            totalVotes: p.total_votes,
            settings: {
                hideResults: p.hide_results,
                allowEdit: p.allow_edit
            },
            options: p.poll_options.map((o: any) => ({
                id: o.id,
                text: o.text,
                votes: o.votes,
                color: o.color
            })),
            wordVotes: p.poll_word_votes.map((wv: any) => ({
                text: wv.text,
                count: wv.count
            }))
        }));
    },

    createPoll: async (
        title: string,
        durationMinutes: number,
        type: PollType,
        customOptions: string[],
        maxVoters: number = 100,
        settings = { hideResults: false, allowEdit: false }
    ): Promise<Poll> => {
        // 1. Crear la votativa principal
        const { data: poll, error: pollError } = await supabase
            .from('polls')
            .insert({
                title,
                type,
                status: 'DRAFT',
                max_voters: maxVoters,
                hide_results: settings.hideResults,
                allow_edit: settings.allowEdit
            })
            .select()
            .single();

        if (pollError) throw pollError;

        // 2. Crear las opciones si no es WordCloud
        if (type !== "WORDCLOUD") {
            let optionsToInsert = customOptions;
            if (type === "BOOLEAN") {
                optionsToInsert = ["A favor", "En contra", "Abstención"];
            }

            const { error: optionsError } = await supabase
                .from('poll_options')
                .insert(optionsToInsert.map(text => ({
                    poll_id: poll.id,
                    text: text,
                    votes: 0
                })));

            if (optionsError) throw optionsError;
        }

        return api.getPollById(poll.id) as Promise<Poll>;
    },

    startPoll: async (id: string, durationMinutes: number): Promise<void> => {
        const now = new Date();
        const endTime = new Date(now.getTime() + durationMinutes * 60 * 1000);

        const { error } = await supabase
            .from('polls')
            .update({
                status: 'ACTIVE',
                start_time: now.toISOString(),
                end_time: endTime.toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    closePoll: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('polls')
            .update({
                status: 'CLOSED',
                end_time: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    },

    vote: async (payload: VotePayload): Promise<{ success: boolean; message: string }> => {
        // Obtener el estado actual de la votación
        const { data: poll, error: pollError } = await supabase
            .from('polls')
            .select('status, type, total_votes')
            .eq('id', payload.pollId)
            .single();

        if (pollError || !poll) return { success: false, message: "Votación no encontrada" };
        if (poll.status !== "ACTIVE") return { success: false, message: "La votación no está activa" };

        if (poll.type === "WORDCLOUD" && payload.word) {
            const word = payload.word.trim().toLowerCase();

            // Upsert para la palabra (si existe suma 1, si no la crea)
            // SQL RPC o lógica simple de select/insert
            const { data: existingWord } = await supabase
                .from('poll_word_votes')
                .select('id, count')
                .eq('poll_id', payload.pollId)
                .eq('text', word)
                .single();

            if (existingWord) {
                await supabase
                    .from('poll_word_votes')
                    .update({ count: existingWord.count + 1 })
                    .eq('id', existingWord.id);
            } else {
                await supabase
                    .from('poll_word_votes')
                    .insert({ poll_id: payload.pollId, text: word, count: 1 });
            }
        } else if (payload.optionId) {
            // Incrementar votos de la opción
            // Usamos un RPC de Supabase para incrementar de forma atómica si es posible, 
            // o un update simple por ahora (menos seguro ante concurrencia masiva)
            const { data: opt } = await supabase
                .from('poll_options')
                .select('votes')
                .eq('id', payload.optionId)
                .single();

            if (opt) {
                await supabase
                    .from('poll_options')
                    .update({ votes: opt.votes + 1 })
                    .eq('id', payload.optionId);
            }
        }

        // Incrementar el total de votos de la encuesta
        await supabase
            .from('polls')
            .update({ total_votes: poll.total_votes + 1 })
            .eq('id', payload.pollId);

        return { success: true, message: "Voto registrado" };
    },

    setHideResults: async (id: string, hide: boolean): Promise<void> => {
        const { error } = await supabase
            .from('polls')
            .update({ hide_results: hide })
            .eq('id', id);
        if (error) throw error;
    },

    deletePoll: async (id: string): Promise<void> => {
        await supabase.from('polls').delete().eq('id', id);
    },

    resetSystem: async () => {
        // Peligroso: Borra todo
        await supabase.from('polls').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
};
