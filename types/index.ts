export interface Option {
  id: string;
  text: string; // "A favor", "En contra", "Abstención"
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  options: Option[];
  startTime: string; // ISO string
  endTime: string | null; // ISO string or null if open
  isActive: boolean;
  totalVotes: number;
}

export interface VotePayload {
  pollId: string;
  optionId: string;
  voterId: string; // Fingerprint
}

export interface PollStats {
  totalVotes: number;
  results: {
    label: string;
    value: number;
    color: string;
  }[];
}
