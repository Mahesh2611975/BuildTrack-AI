import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../../services/taskService";

import { getProjects } from "../../services/projectService";

import useEmployees from "../../hooks/useEmployees";


const PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical",
];


const STATUSES = [
    "Pending",
    "In Progress",
    "Completed",
];


function TasksPage() {

    const [tasks, setTasks] = useState([]);

    const [projects, setProjects] = useState([]);

    const [projectsLoading, setProjectsLoading] =
        useState(false);


    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();


    const [loading, setLoading] =
        useState(true);


    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [priorityFilter, setPriorityFilter] =
        useState("All");


    const [open, setOpen] =
        useState(false);


    const [selectedTask, setSelectedTask] =
        useState(null);


    const [deleteOpen, setDeleteOpen] =
        useState(false);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "",
        status: "Pending",
        start_date: "",
        due_date: "",
        project_id: "",
        employee_id: "",
    });


    const [errors, setErrors] =
        useState({});


    // =====================================================
    // LOAD TASKS
    // =====================================================

    const loadTasks = async () => {

        try {

            setLoading(true);

            const response =
                await getTasks();

            setTasks(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load tasks:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to load tasks"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD PROJECTS
    // =====================================================

    const loadProjects = async () => {

        try {

            setProjectsLoading(true);

            const response =
                await getProjects();

            setProjects(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load projects:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to load projects"
            );

        } finally {

            setProjectsLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadTasks();

        loadProjects();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredTasks = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        return tasks.filter((task) => {

            const matchesSearch =
                !value ||
                task.title
                    ?.toLowerCase()
                    .includes(value) ||
                task.description
                    ?.toLowerCase()
                    .includes(value) ||
                task.priority
                    ?.toLowerCase()
                    .includes(value) ||
                task.status
                    ?.toLowerCase()
                    .includes(value) ||
                getProjectName(task.project_id)
                    ?.toLowerCase()
                    .includes(value) ||
                getEmployeeName(task.employee_id)
                    ?.toLowerCase()
                    .includes(value);

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );
        });

    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
        projects,
        employees,
    ]);


    // =====================================================
    // GET PROJECT NAME
    // =====================================================

    const getProjectName = (projectId) => {

        const project =
            projects.find(
                (item) =>
                    Number(item.id) ===
                    Number(projectId)
            );


        if (!project) {

            return `Project #${projectId}`;

        }


        return (
            `${project.project_name} — ` +
            `${project.project_id}`
        );
    };


    // =====================================================
    // GET EMPLOYEE NAME
    // =====================================================

    const getEmployeeName = (employeeId) => {

        const employee =
            employees.find(
                (item) =>
                    Number(item.id) ===
                    Number(employeeId)
            );


        if (!employee) {

            return `Employee #${employeeId}`;

        }


        return (
            `${employee.full_name} — ` +
            `${employee.employee_id}`
        );
    };


    // =====================================================
    // OPEN ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedTask(null);


        setFormData({
            title: "",
            description: "",
            priority: "",
            status: "Pending",
            start_date: "",
            due_date: "",
            project_id: "",
            employee_id: "",
        });


        setErrors({});


        setOpen(true);
    };


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleEdit = (task) => {

        setSelectedTask(task);


        setFormData({
            title:
                task.title || "",

            description:
                task.description || "",

            priority:
                task.priority || "",

            status:
                task.status || "Pending",

            start_date:
                task.start_date || "",

            due_date:
                task.due_date || "",

            project_id:
                task.project_id || "",

            employee_id:
                task.employee_id || "",
        });


        setErrors({});


        setOpen(true);
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        setErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};


        // Task title

        if (
            !formData.title.trim()
        ) {

            newErrors.title =
                "Task title is required";

        }


        // Priority

        if (!formData.priority) {

            newErrors.priority =
                "Priority is required";

        }


        // Start date

        if (!formData.start_date) {

            newErrors.start_date =
                "Start date is required";

        }


        // Due date

        if (!formData.due_date) {

            newErrors.due_date =
                "Due date is required";

        }


        // Date validation

        if (
            formData.start_date &&
            formData.due_date &&
            formData.due_date <
            formData.start_date
        ) {

            newErrors.due_date =
                "Due date cannot be before start date";

        }


        // Project

        if (!formData.project_id) {

            newErrors.project_id =
                "Project is required";

        }


        // Employee

        if (!formData.employee_id) {

            newErrors.employee_id =
                "Employee is required";

        }


        setErrors(newErrors);


        return (
            Object.keys(newErrors).length === 0
        );
    };


    // =====================================================
    // SAVE TASK
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validate()) {

            return;

        }


        try {

            const data = {

                title:
                    formData.title.trim(),

                description:
                    formData.description.trim() ||
                    null,

                priority:
                    formData.priority,

                start_date:
                    formData.start_date,

                due_date:
                    formData.due_date,

                project_id:
                    Number(
                        formData.project_id
                    ),

                employee_id:
                    Number(
                        formData.employee_id
                    ),
            };


            // UPDATE

            if (selectedTask) {

                await updateTask(
                    selectedTask.id,
                    {
                        ...data,

                        status:
                            formData.status,
                    }
                );


                alert(
                    "Task updated successfully"
                );

            }

            // CREATE

            else {

                await createTask(data);


                alert(
                    "Task created successfully"
                );

            }


            setOpen(false);

            setSelectedTask(null);


            await loadTasks();

        } catch (error) {

            console.error(
                "Task operation failed:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Task operation failed"
            );
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (task) => {

        setSelectedTask(task);

        setDeleteOpen(true);
    };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const confirmDelete = async () => {

        if (!selectedTask) {

            return;

        }


        try {

            await deleteTask(
                selectedTask.id
            );


            alert(
                "Task deleted successfully"
            );


            setDeleteOpen(false);

            setSelectedTask(null);


            await loadTasks();

        } catch (error) {

            console.error(
                "Failed to delete task:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Failed to delete task"
            );
        }
    };


    // =====================================================
    // STATUS COLOR
    // =====================================================

    const getStatusColor = (status) => {

        if (
            status === "Completed"
        ) {

            return "success";

        }


        if (
            status === "In Progress"
        ) {

            return "warning";

        }


        return "default";
    };


    // =====================================================
    // PRIORITY COLOR
    // =====================================================

    const getPriorityColor = (priority) => {

        if (
            priority === "Critical"
        ) {

            return "error";

        }


        if (
            priority === "High"
        ) {

            return "warning";

        }


        if (
            priority === "Medium"
        ) {

            return "info";

        }


        return "default";
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <Box className="page-container">


            {/* ================================================= */}
            {/* HEADER + TOOLBAR */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >

                <Box>

                    <Typography
                        className="page-title"
                        sx={{
                            fontSize: "30px",
                            fontWeight: 700,
                            color: "#241713",
                            mb: 0.5,
                        }}
                    >
                        Tasks
                    </Typography>

                    <Typography color="text.secondary">
                        Manage project tasks and assignments
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1.2,
                        alignItems: "center",
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadTasks}
                        disabled={loading}
                        sx={{
                            borderColor: "#dca62f",
                            color: "#8c6518",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2,
                            "&:hover": {
                                borderColor: "#b98518",
                                backgroundColor: "#fff8e8",
                            },
                        }}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: "#e1a625",
                            color: "#241713",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2.2,
                            boxShadow: "0 3px 8px rgba(130, 91, 16, 0.18)",
                            "&:hover": {
                                backgroundColor: "#cf941b",
                            },
                        }}
                    >
                        Add Task
                    </Button>

                </Box>

            </Box>


            {/* SEARCH + FILTERS */}

            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >

                <TextField
                    placeholder="Search tasks, projects, employees..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    InputProps={{
                        startAdornment: (
                            <SearchIcon
                                sx={{
                                    mr: 1,
                                    color: "text.secondary",
                                }}
                            />
                        ),
                    }}
                    sx={{
                        width: 420,
                        maxWidth: "100%",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "#fffaf0",
                        },
                    }}
                />

                <TextField
                    select
                    label="Status"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                    sx={{
                        minWidth: 165,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "#fffaf0",
                        },
                    }}
                >
                    <MenuItem value="All">
                        All Status
                    </MenuItem>

                    {STATUSES.map((status) => (
                        <MenuItem
                            key={status}
                            value={status}
                        >
                            {status}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Priority"
                    value={priorityFilter}
                    onChange={(event) =>
                        setPriorityFilter(event.target.value)
                    }
                    sx={{
                        minWidth: 165,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2.5,
                            backgroundColor: "#fffaf0",
                        },
                    }}
                >
                    <MenuItem value="All">
                        All Priority
                    </MenuItem>

                    {PRIORITIES.map((priority) => (
                        <MenuItem
                            key={priority}
                            value={priority}
                        >
                            {priority}
                        </MenuItem>
                    ))}
                </TextField>

            </Box>


            {/* ================================================= */}
            {/* TASK TABLE */}
            {/* ================================================= */}

            <Card
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >

                {loading ? (

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 6,
                        }}
                    >

                        <CircularProgress />

                    </Box>

                ) : (

                    <Box
                        sx={{
                            overflowX:
                                "auto",
                        }}
                    >

                        <Box
                            component="table"
                            sx={{
                                width: "100%",
                                borderCollapse:
                                    "collapse",
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Task
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Priority
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Status
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Start Date
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Due Date
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Project
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Assigned Employee
                                    </th>


                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredTasks.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={8}
                                            style={{
                                                padding:
                                                    40,
                                                textAlign:
                                                    "center",
                                            }}
                                        >

                                            <Typography
                                                color="text.secondary"
                                            >
                                                No tasks found
                                            </Typography>

                                        </td>

                                    </tr>

                                ) : (

                                    filteredTasks.map(
                                        (task) => (

                                            <tr
                                                key={
                                                    task.id
                                                }
                                            >


                                                {/* TASK */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <Typography
                                                        fontWeight={
                                                            700
                                                        }
                                                    >
                                                        {
                                                            task.title
                                                        }
                                                    </Typography>


                                                    {task.description && (

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                mt: 0.5,
                                                                maxWidth: 260,
                                                            }}
                                                        >
                                                            {
                                                                task.description
                                                            }
                                                        </Typography>

                                                    )}

                                                </td>


                                                {/* PRIORITY */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <Chip
                                                        label={task.priority}
                                                        color={
                                                            getPriorityColor(
                                                                task.priority
                                                            )
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            minWidth: 76,
                                                        }}
                                                    />

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <Chip
                                                        label={task.status}
                                                        color={
                                                            getStatusColor(
                                                                task.status
                                                            )
                                                        }
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                        }}
                                                    />

                                                </td>


                                                {/* START DATE */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        task.start_date
                                                    }
                                                </td>


                                                {/* DUE DATE */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        task.due_date
                                                    }
                                                </td>


                                                {/* PROJECT */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <Box>
                                                        <Typography
                                                            fontWeight={700}
                                                            sx={{
                                                                fontSize: "14px",
                                                                color: "#2b1c19",
                                                            }}
                                                        >
                                                            {
                                                                projects.find(
                                                                    (project) =>
                                                                        Number(project.id) ===
                                                                        Number(task.project_id)
                                                                )?.project_name ||
                                                                `Project #${task.project_id}`
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "#8b786d",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                projects.find(
                                                                    (project) =>
                                                                        Number(project.id) ===
                                                                        Number(task.project_id)
                                                                )?.project_id ||
                                                                `ID ${task.project_id}`
                                                            }
                                                        </Typography>
                                                    </Box>

                                                </td>


                                                {/* EMPLOYEE */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <Box>
                                                        <Typography
                                                            fontWeight={700}
                                                            sx={{
                                                                fontSize: "14px",
                                                                color: "#2b1c19",
                                                            }}
                                                        >
                                                            {
                                                                employees.find(
                                                                    (employee) =>
                                                                        Number(employee.id) ===
                                                                        Number(task.employee_id)
                                                                )?.full_name ||
                                                                `Employee #${task.employee_id}`
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: "#8b786d",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {
                                                                employees.find(
                                                                    (employee) =>
                                                                        Number(employee.id) ===
                                                                        Number(task.employee_id)
                                                                )?.employee_id ||
                                                                `ID ${task.employee_id}`
                                                            }
                                                        </Typography>
                                                    </Box>

                                                </td>


                                                {/* ACTIONS */}

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >

                                                    <IconButton
                                                        onClick={() =>
                                                            handleEdit(
                                                                task
                                                            )
                                                        }
                                                        sx={{
                                                            color:
                                                                "#dca62f",
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>


                                                    <IconButton
                                                        onClick={() =>
                                                            handleDelete(
                                                                task
                                                            )
                                                        }
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </Box>

                    </Box>

                )}

            </Card>


            {/* ================================================= */}
            {/* ADD / EDIT TASK DIALOG */}
            {/* ================================================= */}

            <Dialog
                open={open}
                onClose={() =>
                    setOpen(false)
                }
                fullWidth
                maxWidth="md"
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                    }}
                >

                    {selectedTask
                        ? "Edit Task"
                        : "Add Task"}

                </DialogTitle>


                <DialogContent>

                    <Box
                        component="form"
                        onSubmit={
                            handleSubmit
                        }
                        sx={{
                            pt: 1,
                        }}
                    >

                        <Grid
                            container
                            spacing={2}
                        >


                            {/* TASK TITLE */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Task Title"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.title
                                        )
                                    }
                                    helperText={
                                        errors.title
                                    }
                                />

                            </Grid>


                            {/* PRIORITY */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Priority"
                                    name="priority"
                                    value={
                                        formData.priority
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.priority
                                        )
                                    }
                                    helperText={
                                        errors.priority
                                    }
                                >

                                    <MenuItem value="">
                                        Select Priority
                                    </MenuItem>


                                    {PRIORITIES.map(
                                        (priority) => (

                                            <MenuItem
                                                key={
                                                    priority
                                                }
                                                value={
                                                    priority
                                                }
                                            >
                                                {priority}
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* DESCRIPTION */}

                            <Grid
                                size={{
                                    xs: 12,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Description"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </Grid>


                            {/* START DATE */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Start Date"
                                    name="start_date"
                                    value={
                                        formData.start_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                    error={
                                        Boolean(
                                            errors.start_date
                                        )
                                    }
                                    helperText={
                                        errors.start_date
                                    }
                                />

                            </Grid>


                            {/* DUE DATE */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Due Date"
                                    name="due_date"
                                    value={
                                        formData.due_date
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                    error={
                                        Boolean(
                                            errors.due_date
                                        )
                                    }
                                    helperText={
                                        errors.due_date
                                    }
                                />

                            </Grid>


                            {/* PROJECT */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Project"
                                    name="project_id"
                                    value={
                                        formData.project_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.project_id
                                        )
                                    }
                                    helperText={
                                        errors.project_id ||
                                        "Select the project for this task"
                                    }
                                >

                                    <MenuItem value="">
                                        Select Project
                                    </MenuItem>


                                    {projects.map(
                                        (project) => (

                                            <MenuItem
                                                key={
                                                    project.id
                                                }
                                                value={
                                                    project.id
                                                }
                                            >

                                                {
                                                    project.project_name
                                                }

                                                {" — "}

                                                {
                                                    project.project_id
                                                }

                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* EMPLOYEE */}

                            <Grid
                                size={{
                                    xs: 12,
                                    md: 6,
                                }}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Assigned Employee"
                                    name="employee_id"
                                    value={
                                        formData.employee_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    error={
                                        Boolean(
                                            errors.employee_id
                                        )
                                    }
                                    helperText={
                                        errors.employee_id ||
                                        "Select the employee responsible for this task"
                                    }
                                >

                                    <MenuItem value="">
                                        Select Employee
                                    </MenuItem>


                                    {employees.map(
                                        (employee) => (

                                            <MenuItem
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >

                                                {
                                                    employee.full_name
                                                }

                                                {" — "}

                                                {
                                                    employee.employee_id
                                                }

                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* STATUS — EDIT ONLY */}

                            {selectedTask && (

                                <Grid
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >

                                    <TextField
                                        select
                                        fullWidth
                                        label="Status"
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        {STATUSES.map(
                                            (status) => (

                                                <MenuItem
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {status}
                                                </MenuItem>

                                            )
                                        )}

                                    </TextField>

                                </Grid>

                            )}


                        </Grid>


                        {/* SAVE */}

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            disabled={
                                projectsLoading ||
                                employeesLoading
                            }
                            sx={{
                                mt: 3,
                                py: 1.4,
                                fontWeight: 700,
                                borderRadius: 2,
                            }}
                        >

                            {selectedTask
                                ? "UPDATE TASK"
                                : "SAVE TASK"}

                        </Button>

                    </Box>

                </DialogContent>

            </Dialog>


            {/* ================================================= */}
            {/* DELETE DIALOG */}
            {/* ================================================= */}

            <Dialog
                open={deleteOpen}
                onClose={() =>
                    setDeleteOpen(false)
                }
            >

                <DialogTitle>
                    Delete Task
                </DialogTitle>


                <DialogContent>

                    <Typography>
                        Are you sure you want to
                        delete{" "}

                        <strong>
                            {selectedTask?.title}
                        </strong>

                        ?
                    </Typography>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setDeleteOpen(false)
                        }
                    >
                        Cancel
                    </Button>


                    <Button
                        color="error"
                        variant="contained"
                        onClick={
                            confirmDelete
                        }
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>


        </Box>
    );
}


// =====================================================
// TABLE STYLES
// =====================================================

const thStyle = {

    textAlign: "left",

    padding: "15px 16px",

    borderBottom:
        "1px solid #eadfca",

    fontWeight: 700,

    color: "#2b1c19",

    whiteSpace: "nowrap",
};


const tdStyle = {

    padding: "15px 16px",

    borderBottom:
        "1px solid #eee5d5",

    verticalAlign: "middle",
};


export default TasksPage;