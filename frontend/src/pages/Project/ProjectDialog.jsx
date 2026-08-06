import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ProjectForm from "./ProjectForm";

function ProjectDialog({
    open,
    handleClose,
    onSubmit,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Add Project
            </DialogTitle>

            <DialogContent>
                <ProjectForm
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ProjectDialog;