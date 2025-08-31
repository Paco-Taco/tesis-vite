import { apiCore } from '@/api/apiCoreInstance';

export class Service {
  protected static async fetchWithPOST<TReq, TRes>(
    url: string,
    body: TReq
  ): Promise<TRes> {
    try {
      const { data } = await apiCore.post<TRes>(url, body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  protected static async fetchWithGET<TRes>(url: string): Promise<TRes> {
    try {
      const { data } = await apiCore.get<TRes>(url);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
