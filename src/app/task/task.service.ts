import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Task } from './task.model';
import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.apiUrl + 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<{ tasks: Task[]; totalCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}
  getTasks(taskPerPage?: number, currentPage?: number) {
    let url = API_BASE_URL;
    currentPage = currentPage ? currentPage : 0;
    console.log(taskPerPage, ' ', currentPage);
    if (taskPerPage && currentPage >= -1) {
      url += `?pagesize=${taskPerPage}&currentpage=${currentPage}`;
    }

    this.http
      .get<{ status: {}; data: Task[]; totalCount: number }>(url)
      .subscribe((taskData) => {
        this.tasks = taskData.data;
        console.log(this.tasks);
        this.tasksUpdated.next({
          tasks: [...this.tasks],
          totalCount: taskData.totalCount,
        });
      });
  }

  getTask(id: string | null) {
    return this.http.get<{ status: {}; data: Task }>(API_BASE_URL + id);
  }

  updateTask(task: Task) {
    let taskData = null;
    if (typeof task.imagePath == 'string') {
      taskData = task;
    } else {
      taskData = new FormData();
      const taskId = task._id ? task._id : '';
      taskData.append('_id', taskId);
      taskData.append('title', task.title);
      taskData.append('description', task.description);
      taskData.append('image', task.imagePath, task.title);
    }
    this.http
      .put<{ status: {}; data: Task }>(API_BASE_URL + task._id, taskData)
      .subscribe((resp) => {
        this.router.navigate(['/']);
      });
  }

  getTaskUpdateListner() {
    return this.tasksUpdated.asObservable();
  }
  addTask(task: Task, image: File) {
    const taskData = new FormData();
    taskData.append('title', task.title);
    taskData.append('description', task.description);
    taskData.append('image', image, task.title);

    this.http
      .post<{ status: {}; data: Task }>(API_BASE_URL, taskData)
      .subscribe((resp) => {
        this.router.navigate(['/']);
      });
  }

  deleteTask(id: string) {
    // console.log('id', id);
    return this.http.delete(API_BASE_URL + id);
  }
}

// mongodb+srv://ritik:<password>@cluster0.tw5on.mongodb.net/todo-mean?retryWrites=true&w=majority
