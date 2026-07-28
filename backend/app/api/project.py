from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)

from app.services.project_service import ProjectService

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post("", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ProjectService.create_project(db, project)


@router.get("", response_model=list[ProjectResponse])
def get_all_projects(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return ProjectService.get_all_projects(db)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    project = ProjectService.get_project_by_id(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    updated_project = ProjectService.update_project(
        db,
        project_id,
        project,
    )

    if updated_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return updated_project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    project = ProjectService.delete_project(
        db,
        project_id,
    )

    if project is None:
       from app.core.exceptions import NotFoundException
       raise NotFoundException("Project not found")
    return {
        "message": "Project deleted successfully"
    }