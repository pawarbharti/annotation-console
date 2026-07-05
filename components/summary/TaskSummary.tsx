"use client";

import { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ReactMarkdown from "react-markdown";

import { API_BASE_URL } from "@/utils/constants";

interface Props {
  taskId: string;
}

export default function TaskSummary({ taskId }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const source = new EventSource(
      `${API_BASE_URL}/api/tasks/${taskId}/summary`,
    );

    source.onmessage = (event) => {
      try {
        const chunk = JSON.parse(event.data);

        setSummary((prev) => prev + chunk);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    source.addEventListener("done", () => {
      source.close();
    });

    source.onerror = () => {
      setError("Failed to stream summary");
      setLoading(false);
      source.close();
    };

    return () => {
      source.close();
    };
  }, [taskId]);

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: "bold",
        }}
      >
        Summary
      </Typography>

      {loading && <CircularProgress size={24} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && <ReactMarkdown skipHtml>{summary}</ReactMarkdown>}
    </>
  );
}
