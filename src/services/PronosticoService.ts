import { Service } from './class/Service.class';

export class PronosticoService extends Service {
  static getCurrentMonthForecast() {
    return this.fetchWithGET('/consumo/pronostico-mes-actual');
  }

  static getCurrentYearForecast() {
    return this.fetchWithGET('/consumo/pronostico-anual');
  }
}
