import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-tambah',
  templateUrl: './tambah.page.html',
  styleUrls: ['./tambah.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule]
})
export class TambahPage {

  nama = '';
  lokasi = '';
  kontak = '';
  jenis = 'Barang Hilang';   // 🔥 default biar jelas
  foto: any = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private storage: StorageService) {}

  // 🔥 upload foto
  uploadFoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.foto = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // 🔥 simpan data
  simpan() {
    if (!this.nama || !this.lokasi || !this.kontak) {
      alert('Isi semua data!');
      return;
    }

    const dataBaru = {
      nama: this.nama,
      lokasi: this.lokasi,
      kontak: this.kontak,

      // 🔥 JENIS TIDAK BERUBAH
      jenis: this.jenis || 'Barang Hilang',

      // 🔥 STATUS TERPISAH (INI PENTING)
      status: 'Belum Ditemukan',

      foto: this.foto,
      createdAt: Date.now()
    };

    this.storage.tambahData(dataBaru);

    alert('Data berhasil disimpan!');

    // 🔥 RESET FORM
    this.nama = '';
    this.lokasi = '';
    this.kontak = '';
    this.jenis = 'Barang Hilang';
    this.foto = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // 🔥 EXPORT PDF
  exportPDF() {
    import('jspdf').then(jsPDFModule => {
      import('jspdf-autotable').then(autoTableModule => {

        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF();
        const autoTable = autoTableModule.default;

        const data = this.storage.getData();

        if (data.length === 0) {
          alert('Data kosong!');
          return;
        }

        const rows = data.map((item: any, i: number) => [
          i + 1,
          item.nama,
          item.lokasi,
          item.kontak,
          item.jenis,
          item.status || 'Belum Ditemukan' // 🔥 tambahan status
        ]);

        autoTable(doc, {
          head: [['No', 'Nama', 'Lokasi', 'Kontak', 'Jenis', 'Status']],
          body: rows
        });

        doc.save('laporan.pdf');
      });
    });
  }
}