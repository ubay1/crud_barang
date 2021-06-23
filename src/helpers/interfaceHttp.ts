export interface IAddBarang {
  id?: any,
  nama_barang: string,
  harga_beli: any,
  harga_jual: any,
  stok: any,
  foto: string,
}

export interface IUpdateBarang {
  id?: any,
  nama_barang: string,
  harga_beli: any,
  harga_jual: any,
  stok: any,
  foto_lama: string,
  foto_baru: string,
}

export interface IModalEdit {
  typeModal?: string
  visibleModal?: any,
  closeModal?: any,
  isPublishData?: any,
  data?: any,
  httpGetdata?: any,
}