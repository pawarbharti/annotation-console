import { render, screen } from "@testing-library/react";
import TaskTable from "@/components/task/TaskTable";

jest.mock("@/redux/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      tasks: {
        ids: [],
        entities: {},
        loading: false,
        error: null,
        search: "",
        filters: {
          status: "ALL",
          type: "ALL",
        },
        sortBy: "updatedAt",
        page: 1,
        pageSize: 20,
        total: 0,
        selectedTaskId: null,
        isCache: false,
      },
    }),
}));

describe("TaskTable", () => {
  it("shows empty state", () => {
    render(<TaskTable />);

    expect(
      screen.getByText(/No tasks found/i)
    ).toBeInTheDocument();
  });
});