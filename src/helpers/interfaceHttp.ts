export interface IAddBarang {
  id?: any,
  nama_barang: string,
  harga_beli: number,
  harga_jual: number,
  stok: number,
  foto: string,
}

export interface IUpdateBarang {
  id?: any,
  nama_barang: string,
  harga_beli: number,
  harga_jual: number,
  stok: number,
  foto_lama: string,
  foto_baru: string,
}