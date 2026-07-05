import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskTicker } from "@/buggy/TaskTicker";

const API = "http://localhost:4000";

function mockFetchOnce(task: {
id: string;
title: string;
status: string;
updatedAt: number;
}) {
return jest.fn().mockResolvedValue({
ok: true,
json: async () => task,
} as Response);
}

afterEach(() => {
jest.restoreAllMocks();
});

describe("TaskTicker", () => {
// BUG 2: no request should fire while nothing is selected.
it("does not fetch when nothing is selected", () => {
const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

render(<TaskTicker apiBase={API} />);

expect(fetchMock).not.toHaveBeenCalled();
});

// BUG 2 + BUG 3: clicking fetches the real id (not /null) and the list keeps
// exactly one row per task id even after selecting the same row twice.
it("fetches the selected task by id and de-dupes on repeat selection", async () => {
const user = userEvent.setup();

const seed = {
id: "t1",
title: "Task 1",
status: "todo",
updatedAt: 1_000,
};
const updated = {
id: "t1",
title: "Task 1 (updated)",
status: "done",
updatedAt: 2_000,
};

const fetchMock = mockFetchOnce(updated);
global.fetch = fetchMock as unknown as typeof fetch;

render(<TaskTicker apiBase={API} initialTasks={[seed]} />);

await user.click(screen.getByText(/Task 1/));

// Correct URL, not /api/tasks/null.
await waitFor(() =>
expect(fetchMock).toHaveBeenCalledWith(`${API}/api/tasks/t1`),
);

// Fresh copy replaced the old one — still a single row for t1.
await waitFor(() =>
expect(screen.getByText(/Task 1 \(updated\)/)).toBeInTheDocument(),
);
expect(screen.getAllByRole("listitem")).toHaveLength(1);

// Select the same task again: still one row, no duplicate appended.
await user.click(screen.getByText(/Task 1 \(updated\)/));
await waitFor(() =>
expect(screen.getAllByRole("listitem")).toHaveLength(1),
);
});

// BUG 1: the "x seconds ago" label advances as time passes (the clock isn't
// frozen by a stale closure).
it("updates the elapsed-time label as the clock ticks", () => {
jest.useFakeTimers();
const start = 1_700_000_000_000;
jest.setSystemTime(start);
global.fetch = jest.fn() as unknown as typeof fetch;

const seed = {
id: "t1",
title: "Task 1",
status: "in_progress",
updatedAt: start,
};

render(<TaskTicker apiBase={API} initialTasks={[seed]} />);

expect(screen.getByText(/0s\s*ago/)).toBeInTheDocument();

act(() => {
jest.advanceTimersByTime(3000);
});

expect(screen.getByText(/3s\s*ago/)).toBeInTheDocument();

jest.useRealTimers();
});
});