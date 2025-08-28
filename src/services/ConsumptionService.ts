import {
  MonthlyConsumptionPayload,
  TodaysConsumptionPayload,
} from '@/infraestructure/payloads/consumption.payloads';
import { Service } from './class/Service.class';
import {
  MonthlyConsumptionResponse,
  TodaysConsumptionResponse,
} from '@/infraestructure/interfaces/consumption.interfaces';

export class ConsumptionService extends Service {
  static getTodaysConsumption(body: TodaysConsumptionPayload) {
    return this.fetchWithPOST<typeof body, TodaysConsumptionResponse>(
      '/consumo/hoy',
      body
    );
  }

  static getMonthlyConsumption(body: MonthlyConsumptionPayload) {
    return this.fetchWithPOST<typeof body, MonthlyConsumptionResponse>(
      '/consumo/mes',
      body
    );
  }
}
