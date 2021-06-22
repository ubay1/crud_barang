import Axios from "axios";
import { AxiosNormal, DevUrl, DevApiUrl } from "./interceptors";
import { IAddBarang, IUpdateBarang } from "./interfaceHttp";

export async function HTTPAddBarang(params: IAddBarang): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        nama_barang: params.nama_barang,
        harga_beli: params.harga_beli,
        harga_jual: params.harga_jual,
        foto: params.foto,
        stok: params.stok,
      }
      const responseAddbarang = await AxiosNormal(2000).post(`${DevApiUrl}/barang`, data)
      return resolve(responseAddbarang)
    } catch (error) {
      return reject(error)
    }
  })
}


export async function HTTPUpdateBarang(params: IUpdateBarang): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = {
        nama_barang: params.nama_barang,
        harga_beli: params.harga_beli,
        harga_jual: params.harga_jual,
        foto_baru: params.foto_baru,
        foto_lama: params.foto_lama,
        stok: params.stok,
      }
      const responseUpdatebarang = await AxiosNormal(2000).put(`${DevApiUrl}/barang/${params.id}`, data)
      return resolve(responseUpdatebarang)
    } catch (error) {
      return reject(error)
    }
  })
}

export async function HTTPReadBarang(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const responseGetbarang = await AxiosNormal(2000).get(`${DevApiUrl}/barangs`)
      return resolve(responseGetbarang)
    } catch (error) {
      return reject(error)
    }
  })
}