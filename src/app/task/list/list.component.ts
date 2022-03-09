import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from '../task.model';
import { TasksService } from '../task.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  // tasks = [
  //   { title: 'code for angular module 1', discription: 'complete the module' },
  //   { title: 'code for angular module 2', discription: 'complete the module' },
  //   { title: 'code for angular module 3', discription: 'complete the module' },
  // ];
  storedTasks: Task[] = [];
  isLoading = false;
  totalTasks = 0;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [1, 5, 10, 100];
  userId = null;

  private tasksSub: Subscription;
  private authListnerSubs: Subscription;
  public userIsAuthenticated = false;

  constructor(
    public tasksService: TasksService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.tasksService.getTasks(this.pageSize, this.pageIndex);
    this.isLoading = true;
    this.tasksSub = this.tasksService
      .getTaskUpdateListner()
      .subscribe((taskData: any) => {
        this.isLoading = false;
        // console.log(tasks);
        this.storedTasks = taskData.tasks;
        this.totalTasks = taskData.totalCount;
      });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.userId = this.authService.getUserId();
    this.authListnerSubs = this.authService
      .getAuthStatusListner()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  onChangePage(event: PageEvent) {
    console.log(event);
    this.pageSize = +event.pageSize;
    this.pageIndex = +event.pageIndex;
    this.tasksService.getTasks(this.pageSize, this.pageIndex);
    console.log(this.totalTasks);
  }

  onDelete(id: any) {
    this.tasksService.deleteTask(id).subscribe((r) => {
      console.log(r);
      this.tasksService.getTasks(this.pageSize, this.pageIndex);
    });
  }
  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authListnerSubs.unsubscribe();
  }
}
