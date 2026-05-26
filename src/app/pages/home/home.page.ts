import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonTitle, 
  IonContent, 
  IonSearchbar, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonButton, 
    IonTitle, 
    IonContent, 
    IonSearchbar, 
    IonIcon
  ]
})
export class HomePage implements OnInit {

  dataBarang: any[] = [];

  filteredData: any[] = [];

  searchText: string = '';

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {

    this.dataBarang =
      this.storage.getData() || [];

    this.filteredData =
      [...this.dataBarang];
  }

  /* SEARCH SECURE FOR ALL MOBILE DEVICES */
  onSearch() {
    const val = this.searchText || '';

    if (val.trim() === '') {
      this.filteredData = [...this.dataBarang];
      return;
    }

    const keyword = val.toLowerCase().trim();

    this.filteredData = this.dataBarang.filter(
      (item: any) => {
        const namaMatch = item.nama && item.nama.toLowerCase().includes(keyword);
        const lokasiMatch = item.lokasi && item.lokasi.toLowerCase().includes(keyword);
        const jenisMatch = item.jenis && item.jenis.toLowerCase().includes(keyword);

        return namaMatch || lokasiMatch || jenisMatch;
      }
    );
  }

  /* STATUS */
  ubahStatus(item: any) {

    item.status =
      'Telah Ditemukan';

    localStorage.setItem(
      'laporan_barang',
      JSON.stringify(this.dataBarang)
    );

    this.loadData();
  }

  /* KETERANGAN */
  tujuan(item: any) {

    return item.jenis ===
      'Barang Hilang'
      ? 'Mencari pemilik'
      : 'Menunggu diambil';
  }

  /* FORMAT TANGGAL */
  formatTanggal(date: any) {

    return new Date(date)
      .toLocaleString('id-ID');
  }

  /* SISA WAKTU */
  sisaWaktu(item: any) {

    const created =
      new Date(item.createdAt)
        .getTime();

    const now =
      new Date().getTime();

    const expired =
      created +
      3 * 24 * 60 * 60 * 1000;

    const selisih =
      expired - now;

    if (selisih <= 0) {
      return 'Expired';
    }

    const jam = Math.floor(
      selisih /
      (1000 * 60 * 60)
    );

    return `${jam} jam lagi`;
  }

  /* BACK */
  goBack() {
    this.router.navigate(['/tambah']);
  }

}