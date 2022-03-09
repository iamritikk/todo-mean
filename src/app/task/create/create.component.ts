import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Task } from '../task.model';
import { TasksService } from '../task.service';
import { imageTypeValidator } from './image-type.validator';
@Component({
  selector: 'app-task-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  mode = 'create';
  private taskId: string | null = null;
  task: Task;

  taskForm: FormGroup;
  isLoading = false;

  public imagePreview: any;
  constructor(
    public tasksService: TasksService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.taskForm = new FormGroup({
          title: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(4)],
          }),
          description: new FormControl(null, {
            validators: [Validators.required],
          }),
          image: new FormControl(null, {
            validators: [Validators.required],
          }),
        });
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.isLoading = true;
        this.tasksService.getTask(this.taskId).subscribe((resp) => {
          this.isLoading = false;
          this.task = resp.data;
          this.taskForm.setValue({
            title: this.task.title,
            description: this.task.description,
            image: this.task.imagePath,
          });
        });
      } else {
        this.taskForm = new FormGroup({
          title: new FormControl(null, {
            validators: [Validators.required, Validators.minLength(4)],
          }),
          description: new FormControl(null, {
            validators: [Validators.required],
          }),
          image: new FormControl(null, {
            validators: [Validators.required, imageTypeValidator],
          }),
        });
        this.mode = 'create';
        this.taskId = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    // const file = (event.target as HTMLInputElement).files[0];
    this.taskForm.patchValue({ image: file });
    this.taskForm.get('image')?.updateValueAndValidity();
    // console.log(this.taskForm, file);
    this.imageToDataUrl(file);
  }
  imageToDataUrl(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveTask() {
    if (!this.taskForm.valid) {
      return;
    }
    const task: Task = {
      _id: null,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      imagePath: this.taskForm.value.image,
      creator: '',
    };
    if (this.mode == 'edit') {
      task._id = this.task._id;
      this.tasksService.updateTask(task);
    } else {
      this.tasksService.addTask(task, this.taskForm.value.image);
    }
    this.taskForm.reset();
  }
}
