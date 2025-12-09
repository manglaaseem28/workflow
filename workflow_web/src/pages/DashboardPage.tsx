import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { Workflow, Task } from "../types";

const STATUSES: Task["status"][] = ["initial", "planning", "review", "closed"];

type TaskFormState = {
  id?: number;
  title: string;
  description: string;
  status: Task["status"];
};

const emptyTaskForm = (status: Task["status"]): TaskFormState => ({
  title: "",
  description: "",
  status,
});

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [workflowSaving, setWorkflowSaving] = useState(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskFormState>(
    emptyTaskForm("initial")
  );
  const [isEditing, setIsEditing] = useState(false);

  // -------- API helpers --------

  const fetchWorkflows = async () => {
    const res = await api.get<Workflow[]>("/workflows");
    setWorkflows(res.data);
    if (res.data.length > 0 && selectedWorkflowId === "") {
      setSelectedWorkflowId(res.data[0].id);
    }
  };

  const fetchTasks = async (workflowId: number) => {
    setLoading(true);
    try {
      const res = await api.get<Task[]>(`/workflows/${workflowId}/tasks`);
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    if (selectedWorkflowId && typeof selectedWorkflowId === "number") {
      fetchTasks(selectedWorkflowId);
    }
  }, [selectedWorkflowId]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<Task["status"], Task[]> = {
      initial: [],
      planning: [],
      review: [],
      closed: [],
    };
    tasks.forEach((t) => grouped[t.status].push(t));
    return grouped;
  }, [tasks]);

  // -------- Handlers --------

  const handleOpenCreateTask = (status: Task["status"]) => {
    setIsEditing(false);
    setTaskForm(emptyTaskForm(status));
    setTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setIsEditing(true);
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setTaskDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setTaskDialogOpen(false);
  };

  const handleTaskFormChange = (field: keyof TaskFormState, value: string) => {
    setTaskForm((prev) => ({
      ...prev,
      [field]: field === "status" ? (value as Task["status"]) : value,
    }));
  };

  const handleSubmitTask = async () => {
    if (!selectedWorkflowId || typeof selectedWorkflowId !== "number") return;

    const payload = {
      task: {
        title: taskForm.title,
        description: taskForm.description,
        status: taskForm.status,
      },
    };

    try {
      if (isEditing && taskForm.id) {
        // update
        const res = await api.patch<Task>(
          `/workflows/${selectedWorkflowId}/tasks/${taskForm.id}`,
          payload
        );
        setTasks((prev) =>
          prev.map((t) => (t.id === res.data.id ? res.data : t))
        );
      } else {
        // create
        const res = await api.post<Task>(
          `/workflows/${selectedWorkflowId}/tasks`,
          payload
        );
        setTasks((prev) => [res.data, ...prev]);
      }
      setTaskDialogOpen(false);
    } catch (error) {
      // in real app, show snackbar
      console.error("Error saving task", error);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!newWorkflowName.trim()) {
      setWorkflowError("Name is required");
      return;
    }

    setWorkflowSaving(true);
    setWorkflowError(null);

    try {
      const res = await api.post<Workflow>("/workflows", {
        workflow: { name: newWorkflowName.trim() },
      });

      const created = res.data;

      // Update list & select it
      setWorkflows((prev) => [...prev, created]);
      setSelectedWorkflowId(created.id);
      setWorkflowDialogOpen(false);
      setNewWorkflowName("");
    } catch (error: any) {
      console.error(error);
      setWorkflowError("Could not create workflow. Please try again.");
    } finally {
      setWorkflowSaving(false);
    }
  };

  // -------- UI helpers --------

  const statusLabel = (status: Task["status"]) => {
    switch (status) {
      case "initial":
        return "Initial";
      case "planning":
        return "Planning";
      case "review":
        return "Review";
      case "closed":
        return "Closed";
    }
  };

  const statusColor = (status: Task["status"]) => {
    switch (status) {
      case "initial":
        return "info";
      case "planning":
        return "primary";
      case "review":
        return "warning";
      case "closed":
        return "success";
    }
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(200,200,230,0.5)",
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
          <Typography variant="h6">
            Workflow Board
            <Typography
              component="span"
              variant="caption"
              sx={{
                ml: 1,
                px: 1,
                py: 0.4,
                borderRadius: 2,
                background: "#ede9ff",
                color: "#5b21b6",
                fontWeight: 500,
              }}
            >
              Better than Jira :)
            </Typography>
          </Typography>

          {user && (
            <Box mr={2} textAlign="right">
              <Typography variant="body2">{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.company.name}
              </Typography>
            </Box>
          )}
          <Button
            color="error"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={signOut}
            sx={{
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.5)",
              px: 1.8,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          maxWidth: 1200,
          mt: 4,
          mb: 5,
          borderRadius: 4,
          border: "1px solid rgba(148,163,184,0.35)",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.98), rgba(15,23,42,1))",
          boxShadow: "0 24px 70px rgba(15,23,42,0.95)",
          p: 3,
        }}
      >
        {/* toolbar inside card */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          gap={2}
          flexWrap="wrap"
        >
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="workflow-select-label">Workflow</InputLabel>
            <Select
              labelId="workflow-select-label"
              label="Workflow"
              value={selectedWorkflowId}
              onChange={(e) =>
                setSelectedWorkflowId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              {workflows.map((wf) => (
                <MenuItem key={wf.id} value={wf.id}>
                  {wf.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              {loading ? "Loading tasks…" : `${tasks.length} tasks`}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setNewWorkflowName("");
                setWorkflowError(null);
                setWorkflowDialogOpen(true);
              }}
            >
              + New workflow
            </Button>
          </Box>
        </Box>

        {/* board columns */}
        <Grid container spacing={2}>
          {STATUSES.map((status) => (
            <Grid item xs={12} sm={6} md={3} key={status}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  borderColor: "rgba(180,180,220,0.3)",
                  boxShadow: "0 8px 22px rgba(120,120,160,0.15)",
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.7 }}
                    >
                      {statusLabel(status)}
                    </Typography>
                    <Chip
                      size="small"
                      label={tasksByStatus[status].length}
                      color={statusColor(status)}
                      variant="outlined"
                    />
                  </Box>

                  <Box mt={1} mb={1}>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<AddIcon fontSize="small" />}
                      onClick={() => handleOpenCreateTask(status)}
                    >
                      Add task
                    </Button>
                  </Box>

                  <Stack spacing={1}>
                    {tasksByStatus[status].map((task) => (
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: "pointer",
                          borderRadius: 3,
                          border: "1px solid rgba(150,150,200,0.25)",
                          background: "white",
                          "&:hover": {
                            boxShadow: "0 6px 20px rgba(120,120,160,0.2)",
                            transform: "translateY(-2px)",
                            transition: "0.2s",
                          },
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.2, "&:last-child": { pb: 1.2 } }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {task.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditTask(task);
                              }}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Task Create/Edit Dialog */}
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "white",
            border: "1px solid rgba(200,200,230,0.4)",
          },
        }}
        open={taskDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent dividers>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              size="small"
              value={taskForm.title}
              onChange={(e) => handleTaskFormChange("title", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              size="small"
              value={taskForm.description}
              onChange={(e) =>
                handleTaskFormChange("description", e.target.value)
              }
              fullWidth
              multiline
              minRows={3}
            />
            <FormControl size="small" fullWidth>
              <InputLabel id="task-status-label">Status</InputLabel>
              <Select
                labelId="task-status-label"
                label="Status"
                value={taskForm.status}
                onChange={(e) => handleTaskFormChange("status", e.target.value)}
              >
                {STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {statusLabel(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitTask} variant="contained">
            {isEditing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={workflowDialogOpen}
        onClose={() => setWorkflowDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(200,200,230,0.6)",
          },
        }}
      >
        <DialogTitle>Create workflow</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Workflow name"
              size="small"
              fullWidth
              value={newWorkflowName}
              onChange={(e) => {
                setNewWorkflowName(e.target.value);
                if (workflowError) setWorkflowError(null);
              }}
              autoFocus
            />
            {workflowError && (
              <Typography variant="caption" color="error">
                {workflowError}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Workflows group tasks into a board (e.g. “Platform team”,
              “Hiring”, “Release v1.0”).
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkflowDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateWorkflow}
            variant="contained"
            disabled={workflowSaving}
          >
            {workflowSaving ? "Creating…" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardPage;
