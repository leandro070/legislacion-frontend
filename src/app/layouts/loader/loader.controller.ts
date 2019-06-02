import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderController {

  private loaderSource = new BehaviorSubject(false);
  currentVisibility = this.loaderSource.asObservable();

  constructor() { }

  private changeVisibility(isVisible: boolean) {
    this.loaderSource.next(isVisible);
  }

  public show() {
    this.changeVisibility(true);
  }

  public hide() {
    this.changeVisibility(false);
  }
}
