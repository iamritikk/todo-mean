import { AbstractControl } from '@angular/forms';

export const imageTypeValidator = (control: AbstractControl) => {
  const file = control.value as File;
  if (!file) return { invalidFileType: true };
  switch (file.type) {
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
      return null;
      break;
    default:
      return { invalidFileType: true };
  }
};
