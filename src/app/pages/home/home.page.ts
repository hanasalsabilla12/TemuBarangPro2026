import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 🔥 TAMBAH INI
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  dataBarang: any[] = [];
  searchText: string = '';

  constructor(
    private storage: StorageService,
    private router: Router // 🔥 TAMBAH INI
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.dataBarang = this.storage.getData();
  }

  getFilteredData() {
    return this.dataBarang.filter(item =>
      item.nama?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ubahStatus(item: any) {
    item.status = "Telah Ditemukan";
    localStorage.setItem("laporan_barang", JSON.stringify(this.dataBarang));
  }

  tujuan(item: any) {
    return item.jenis === "Barang Hilang"
      ? "Mencari pemilik"
      : "Menunggu diambil";
  }

  formatTanggal(date: any) {
    return new Date(date).toLocaleString();
  }

  sisaWaktu(item: any) {
    return "3 hari";
  }

  // 🔥 INI YANG BUAT TOMBOL PANAH JALAN
  goBack() {
    this.router.navigate(['/tambah']);
  }
}