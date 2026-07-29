from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
)
from app.repository.task_repository import TaskRepository


class TaskService:

    @staticmethod
    def create_task(
        db: Session,
        request: TaskCreate,
    ):
        task = Task(
            title=request.title,
            description=request.description,
            priority=request.priority,
            status="Pending",
            start_date=request.start_date,
            due_date=request.due_date,
            project_id=request.project_id,
            employee_id=request.employee_id,
        )

        return TaskRepository.create_task(
            db,
            task,
        )

    @staticmethod
    def get_all_tasks(
        db: Session,
    ):
        return TaskRepository.get_all_tasks(db)

    @staticmethod
    def update_task(
        db: Session,
        task_id: int,
        request: TaskUpdate,
    ):
        task = TaskRepository.get_task_by_id(
            db,
            task_id,
        )

        if not task:
            return None

        task.title = request.title
        task.description = request.description
        task.priority = request.priority
        task.status = request.status
        task.start_date = request.start_date
        task.due_date = request.due_date
        task.project_id = request.project_id
        task.employee_id = request.employee_id

        return TaskRepository.update_task(
            db,
            task,
        )

    @staticmethod
    def delete_task(
        db: Session,
        task_id: int,
    ):
        task = TaskRepository.get_task_by_id(
            db,
            task_id,
        )

        if not task:
            return None

        TaskRepository.delete_task(
            db,
            task,
        )

        return True