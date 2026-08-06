import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ProjectForm from "./ProjectForm";

function ProjectDialog({
    open,
    handleClose,
    onSubmit,
    project = null,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {project ? "Edit Project" : "Add Project"}
            </DialogTitle>

            <DialogContent>
                <ProjectForm
                    project={project}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProjectDialog;