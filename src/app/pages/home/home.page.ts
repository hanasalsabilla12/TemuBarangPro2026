import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule]
})
export class HomePage implements OnInit {

  barangList: any[] = [];
  searchText = '';

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let data = this.storage.getData();
    const now = Date.now();

    // auto delete 3 hari
    data = data.filter(item => now - item.createdAt < 3 * 24 * 60 * 60 * 1000);

    data = data.map(item => ({
      ...item,
      status: item.status || 'Belum Ditemukan'
    }));

    this.storage.saveData(data);
    this.barangList = data;
  }

  getFilteredData() {
    return this.barangList.filter(item =>
      item.nama.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ubahStatus(item: any) {
    if (item.status === 'Telah Ditemukan') return;

    item.status = 'Telah Ditemukan';
    this.storage.saveData(this.barangList);
    this.loadData();
  }

  sisaWaktu(item: any) {
    const sisa = 3 * 24 * 60 * 60 * 1000 - (Date.now() - item.createdAt);

    const hari = Math.floor(sisa / (1000 * 60 * 60 * 24));
    const jam = Math.floor((sisa / (1000 * 60 * 60)) % 24);

    return `Sisa ${hari} hari ${jam} jam`;
  }

  formatTanggal(time: number) {
    return new Date(time).toLocaleString('id-ID');
  }

  tujuan(item: any) {
    return item.jenis === 'Barang Ditemukan'
      ? 'Mencari pemilik barang'
      : 'Mencari penemu barang';
  }
}