import { useMemo, useReducer, useState } from 'react';
import {
  View, Flex, Heading, Link, Avatar, ListView, Item, Checkbox, Divider, DialogTrigger, Dialog, Content, ButtonGroup, Button, TextField, Form, ActionButton
} from '@adobe/react-spectrum';
import Add from '@spectrum-icons/workflow/Add';
import Delete from '@spectrum-icons/workflow/Delete';
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
    case 'add':
      return [...state, { id: nextId++, title: action.title, completed: false }];
    case 'delete':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

/* -------------- Top navigation -------------- */
function TopNav({ filter, setFilter, dispatch }: { filter: Filter, setFilter: (filter: Filter) => void, dispatch: React.Dispatch<Action> }) {
  const is = (path: Filter) => filter === path;
  const [title, setTitle] = useState('');

  const linkProps = (to: Filter) => ({
    onPress: () => setFilter(to),
    UNSAFE_className: `nav-link ${is(to) ? 'active' : ''}`,
  });

  const handleAdd = () => {
    if (title.trim() !== '') {
      dispatch({ type: 'add', title });
      setTitle('');
    }
  };

  return (
    <View position="sticky" top={0} backgroundColor="gray-50" padding="size-200" zIndex={1}>
      <Flex alignItems="center" justifyContent="space-between" gap="size-300">
        {/* Left: brand */}
        <Heading level={3} margin={0}>Spectrum Todo</Heading>

        {/* Center: filter links */}
        <Flex gap="size-300" alignItems="center">
          <Link {...linkProps('all')}>All</Link>
          <Link {...linkProps('active')}>Active</Link>
          <Link {...linkProps('completed')}>Completed</Link>
        </Flex>

        {/* Right: user avatar and add button */}
        <Flex gap="size-100" alignItems="center">
          <DialogTrigger>
            <ActionButton isQuiet>
              <Add />
            </ActionButton>
            {(close) => (
              <Dialog>
                <Heading>Add Task</Heading>
                <Content>
                  <Form onSubmit={(e) => { e.preventDefault(); handleAdd(); close(); }}>
                    <TextField
                      label="Title"
                      value={title}
                      onChange={setTitle}
                      autoFocus
                    />
                  </Form>
                </Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>Cancel</Button>
                  <Button variant="cta" onPress={() => { handleAdd(); close(); }}>Save</Button>
                </ButtonGroup>
              </Dialog>
            )}
          </DialogTrigger>
          <Avatar alt="User" UNSAFE_className="user-avatar">A</Avatar>
        </Flex>
      </Flex>
    </View>
  );
}

/* -------------- List (filtered by selection) -------------- */
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
              <ActionButton isQuiet onPress={() => dispatch({ type: 'delete', id: todo.id })}>
                <Delete />
              </ActionButton>
            </Item>
        ))}
      </ListView>
    </View>
  );
}

/* -------------- App -------------- */
export default function App() {
  const [todos, dispatch] = useReducer(reducer, initial);
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <View>
      <TopNav filter={filter} setFilter={setFilter} dispatch={dispatch} />
      <Divider size="S" />
      <TodoList todos={todos} dispatch={dispatch} filter={filter} />
    </View>
  );
}
