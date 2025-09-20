type Filter = 'all' | 'active' | 'completed';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

type Action =
    | { type: 'toggle'; id: number };

export type { Todo, Action, Filter };