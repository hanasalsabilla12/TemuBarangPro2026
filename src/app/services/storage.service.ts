import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private key = 'temu_barang';

  getData(): any[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  saveData(data: any[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  tambahData(item: any) {
    const data = this.getData();
    data.push(item);
    this.saveData(data);
  }
}