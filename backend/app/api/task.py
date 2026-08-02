from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_admin

from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
)

from app.services.task_service import TaskService

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post(
    "/",
    response_model=TaskResponse,
)
def create_task(
    request: TaskCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return TaskService.create_task(
        db,
        request,
    )


@router.get(
    "/",
    response_model=list[TaskResponse],
)
def get_all_tasks(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return TaskService.get_all_tasks(db)
@router.get(
    "/project/{project_id}",
    response_model=list[TaskResponse],
)
def get_tasks_by_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return TaskService.get_tasks_by_project(
        db,
        project_id,
    )
@router.get(
    "/employee/{employee_id}",
    response_model=list[TaskResponse],
)
def get_tasks_by_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return TaskService.get_tasks_by_employee(
        db,
        employee_id,
    )
@router.get(
    "/status/{status}",
    response_model=list[TaskResponse],
)
def get_tasks_by_status(
    status: str,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    return TaskService.get_tasks_by_status(
        db,
        status,
    )
@router.put(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    request: TaskUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    task = TaskService.update_task(
        db,
        task_id,
        request,
    )

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return task


@router.delete(
    "/{task_id}",
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    deleted = TaskService.delete_task(
        db,
        task_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return {
        "message": "Task deleted successfully"
    }