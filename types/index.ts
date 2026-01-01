export type PollType = "BOOLEAN" | "MULTIPLE" | "WORDCLOUD";
export type PollStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export interface Option {
  id: string;
  text: string;
  votes: number;
  color?: string;
}

export interface WordVote {
  text: string;
  count: number;
}

export interface Poll {
  id: string;
  title: string;
  type: PollType;
  status: PollStatus;
  options: Option[];
  wordVotes?: WordVote[];
  startTime: string | null;
  endTime: string | null;
  maxVoters: number;
  totalVotes: number;
  settings: {
    hideResults: boolean;
    allowEdit: boolean;
  };
}

export interface VotePayload {
  pollId: string;
  optionId?: string;
  word?: string;
  voterId: string;
}
