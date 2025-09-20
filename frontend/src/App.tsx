import { useMemo, useReducer } from 'react';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';
import {
  View, Flex, Heading, Link, Avatar, ListView, Item, Checkbox, Divider,
} from '@adobe/react-spectrum';
import type { Action, Filter, Todo } from './types/Types';


/* -------------- State/reducer -------------- */
let nextId = 4;
const initial: Todo[] = [
  { id: 1, title: 'Design navigation', completed: true },
  { id: 2, title: 'Hook up routes', completed: false },
  { id: 3, title: 'Style active underline', completed: false },
];

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t);
    default:
      return state;
  }
}

/* -------------- Top navigation -------------- */
function TopNav() {
  const location = useLocation();
  const is = (path: string) => location.pathname === path;

  // Spectrum's Link accepts `elementType` as a React component type
  const linkProps = (to: string) => ({
    elementType: RouterLink as ComponentType<any>,
    to,
    UNSAFE_className: `nav-link ${is(to) ? 'active' : ''}`,
  });

  return (
    <View position="sticky" top={0} backgroundColor="gray-50" padding="size-200" zIndex={1}>
      <Flex alignItems="center" justifyContent="space-between" gap="size-300">
        {/* Left: brand */}
        <Heading level={3} margin={0}>Spectrum Todo</Heading>

        {/* Center: filter links */}
        <Flex gap="size-300" alignItems="center">
          <Link {...linkProps('/')}>All</Link>
          <Link {...linkProps('/active')}>Active</Link>
          <Link {...linkProps('/completed')}>Completed</Link>
        </Flex>

        {/* Right: user avatar */}
        <Avatar alt="User" UNSAFE_className="user-avatar">A</Avatar>
      </Flex>
    </View>
  );
}

/* -------------- List (filtered by route) -------------- */
function TodoList({
  todos, filter, dispatch,
}: {
  todos: Todo[];
  filter: Filter;
  dispatch: React.Dispatch<Action>;
}) {
  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <View padding="size-300">
      <ListView aria-label="Todos" selectionMode="none" density="compact">
        {filtered.map(todo => (
          <Item key={todo.id} textValue={todo.title}>
            <Checkbox
              isSelected={todo.completed}
              onChange={() => dispatch({ type: 'toggle', id: todo.id })}
            >
              {todo.title}
            </Checkbox>
          </Item>
        ))}
      </ListView>
    </View>
  );
}

/* -------------- App -------------- */
export default function App() {
  const [todos, dispatch] = useReducer(reducer, initial);

  return (
    <View>
      <TopNav />
      <Divider size="S" />
      <Routes>
        <Route path="/" element={<TodoList todos={todos} dispatch={dispatch} filter="all" />} />
        <Route path="/active" element={<TodoList todos={todos} dispatch={dispatch} filter="active" />} />
        <Route path="/completed" element={<TodoList todos={todos} dispatch={dispatch} filter="completed" />} />
      </Routes>
    </View>
  );
}
