import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Plugin simpan file ke Android
import { Filesystem, Directory } from '@capacitor/filesystem';

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
  jenis = 'Barang Hilang';
  foto: any = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private storage: StorageService) {}

  // Upload foto
  uploadFoto(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.foto = reader.result;
    };

    reader.readAsDataURL(file);
  }

  // Simpan data
  simpan() {
    if (!this.nama || !this.lokasi || !this.kontak) {
      alert('Isi semua data!');
      return;
    }

    const dataBaru = {
      nama: this.nama,
      lokasi: this.lokasi,
      kontak: this.kontak,
      jenis: this.jenis || 'Barang Hilang',
      status: 'Belum Ditemukan',
      foto: this.foto,
      createdAt: Date.now()
    };

    this.storage.tambahData(dataBaru);

    alert('Data berhasil disimpan!');

    // Reset form
    this.nama = '';
    this.lokasi = '';
    this.kontak = '';
    this.jenis = 'Barang Hilang';
    this.foto = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Export PDF ke HP
  async exportPDF() {
    try {
      const doc = new jsPDF();
      const data = this.storage.getData() || [];

      if (!Array.isArray(data) || data.length === 0) {
        alert('Data kosong!');
        return;
      }

      const rows = data.map((item: any, i: number) => [
        i + 1,
        item.nama || '-',
        item.lokasi || '-',
        item.kontak || '-',
        item.jenis || '-',
        item.status || 'Belum Ditemukan'
      ]);

      autoTable(doc, {
        head: [['No', 'Nama', 'Lokasi', 'Kontak', 'Jenis', 'Status']],
        body: rows
      });

      // Convert PDF ke base64
      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];

      // Simpan ke storage HP
      await Filesystem.writeFile({
        path: 'laporan.pdf',
        data: base64Data,
        directory: Directory.Documents
      });

      alert('PDF berhasil disimpan di folder Documents!');

    } catch (error) {
      console.error('Error export PDF:', error);
      alert('Gagal menyimpan PDF.');
    }
  }
}