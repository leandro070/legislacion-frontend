import { Component, OnInit } from '@angular/core';
import { LoaderController } from './loader.controller';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isVisible = false;

  constructor(private loaderCtrl: LoaderController) { }

  ngOnInit() {
    this.loaderCtrl.currentVisibility.subscribe(visibility => {
      this.isVisible = visibility;
    });
  }

}
