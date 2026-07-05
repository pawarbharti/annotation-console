import {
  normalizeTaskType,
  normalizeTaskStatus,
  normalizeTask,
} from "@/utils/normalize";

describe("normalizeTaskType", () => {
  it("should normalize image type", () => {
    expect(normalizeTaskType("image")).toBe("IMAGE");
  });

  it("should normalize audio type", () => {
    expect(normalizeTaskType("audio")).toBe("AUDIO");
  });

  it("should normalize text type", () => {
    expect(normalizeTaskType("text")).toBe("TEXT");
  });

  it("should return UNKNOWN for unsupported types", () => {
    expect(normalizeTaskType("video")).toBe("UNKNOWN");
  });
});

describe("normalizeTaskStatus", () => {
  it("should normalize in_progress", () => {
    expect(normalizeTaskStatus("in_progress")).toBe("IN_PROGRESS");
  });

  it("should normalize InProgress", () => {
    expect(normalizeTaskStatus("InProgress")).toBe("IN_PROGRESS");
  });

  it("should normalize QA", () => {
    expect(normalizeTaskStatus("QA")).toBe("QA");
  });

  it("should normalize done", () => {
    expect(normalizeTaskStatus("done")).toBe("DONE");
  });

  it("should return UNKNOWN", () => {
    expect(normalizeTaskStatus("random")).toBe("UNKNOWN");
  });
});

describe("normalizeTask", () => {
  it("should normalize a complete API task", () => {
    const apiTask = {
      id: "t1",
      title: "Task 1",
      type: "image",
      status: "done",
      assignee: {
        id: "u1",
        name: "Asha",
      },
      annotationCount: "5",
      updatedAt: "2024-06-28T18:00:00.000Z",
      meta: {
        priority: "high",
      },
    };

    const task = normalizeTask(apiTask);

    expect(task.id).toBe("t1");
    expect(task.type).toBe("IMAGE");
    expect(task.status).toBe("DONE");
    expect(task.annotationCount).toBe(5);
    expect(task.meta.priority).toBe("high");
  });
});