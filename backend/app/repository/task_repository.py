from sqlalchemy.orm import Session

from app.models.task import Task


class TaskRepository:

    @staticmethod
    def create_task(
        db: Session,
        task: Task,
    ):
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_all_tasks(
        db: Session,
    ):
        return db.query(Task).all()

    @staticmethod
    def get_tasks_by_project(
            db: Session,
            project_id: int,
        ):
            return (
                db.query(Task)
                .filter(Task.project_id == project_id)
                .all()
            )
    @staticmethod
    def get_tasks_by_employee(
        db: Session,
        employee_id: int,
    ):
        return (
            db.query(Task)
            .filter(Task.employee_id == employee_id)
            .all()
        )
    @staticmethod
    def get_task_by_id(
        db: Session,
        task_id: int,
    ):
        return (
            db.query(Task)
            .filter(Task.id == task_id)
            .first()
        )

    @staticmethod
    def update_task(
        db: Session,
        task: Task,
    ):
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete_task(
        db: Session,
        task: Task,
    ):
        db.delete(task)
        db.commit()