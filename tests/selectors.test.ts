import { selectFilteredTasks } from "@/redux/tasks/selectors";
import { TaskStatus, TaskType } from "@/types/task";
import type { RootState } from "@/redux/store";
const createState = () =>
  ({
    tasks: {
      ids: ["1", "2"],
      entities: {
        "1": {
          id: "1",
          title: "Image Task",
          type: TaskType.IMAGE,
          status: TaskStatus.DONE,
          assignee: null,
          annotationCount: 2,
          updatedAt: 200,
          meta: {},
        },
        "2": {
          id: "2",
          title: "Audio Task",
          type: TaskType.AUDIO,
          status: TaskStatus.TODO,
          assignee: null,
          annotationCount: 1,
          updatedAt: 100,
          meta: {},
        },
      },

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
      total: 2,
      selectedTaskId: null,
      isCache: false,
    },
  }) as unknown as RootState;

describe("selectFilteredTasks", () => {
  it("returns all tasks", () => {
    const state = createState();

    expect(selectFilteredTasks(state)).toHaveLength(2);
  });

  it("filters by search", () => {
    const state = createState();

    state.tasks.search = "image";

    expect(selectFilteredTasks(state)).toHaveLength(1);
    expect(selectFilteredTasks(state)[0].title).toBe("Image Task");
  });

  it("filters by status", () => {
    const state = createState();

    state.tasks.filters.status = TaskStatus.DONE;

    expect(selectFilteredTasks(state)).toHaveLength(1);
  });

  it("filters by type", () => {
    const state = createState();

    state.tasks.filters.type = TaskType.AUDIO;

    expect(selectFilteredTasks(state)).toHaveLength(1);
  });

  it("sorts by updatedAt", () => {
    const state = createState();

    state.tasks.sortBy = "updatedAt";

    const result = selectFilteredTasks(state);

    expect(result[0].updatedAt).toBeGreaterThan(result[1].updatedAt);
  });

  it("sorts by title", () => {
    const state = createState();

    state.tasks.sortBy = "title";

    const result = selectFilteredTasks(state);

    expect(result[0].title).toBe("Audio Task");
  });
});