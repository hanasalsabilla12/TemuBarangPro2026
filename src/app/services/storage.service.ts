import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  key = "laporan_barang";

  getData(): any[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  tambahData(item: any) {
    const data = this.getData();
    data.push(item);
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}