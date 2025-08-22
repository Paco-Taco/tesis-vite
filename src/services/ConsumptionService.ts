import {
  MonthlyConsumptionPayload,
  TodaysConsumptionPayload,
} from '@/infraestructure/payloads/consumption.payloads';
import { Service } from './class/Service.class';

export class ConsumptionService extends Service {
  static getTodaysConsumption(body: TodaysConsumptionPayload) {
    return this.fetchWithPOST('/consumo/hoy', body);
  }

  static getMonthlyConsumption(body: MonthlyConsumptionPayload) {
    return this.fetchWithPOST('/consumo/mes', body);
  }
}
