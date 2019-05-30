import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setValue(key: string, value: any): void {
    const valueJson = JSON.stringify(value);
    localStorage.setItem(key, valueJson);
  }

  removeValue(key: string): any {
    const valueJson = localStorage.getItem(key);
    return JSON.parse(valueJson);
  }
}
