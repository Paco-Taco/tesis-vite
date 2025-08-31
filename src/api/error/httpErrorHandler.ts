import axios, { AxiosError } from 'axios';

const throwServerMessage = (error: AxiosError) => {
  const message =
    (error.response?.data as { message?: string })?.message ??
    'Error del servidor';

  return Promise.reject(new Error(message));
};

export const httpErrorHandler = (error: AxiosError) => {
  if (!error) return Promise.reject(new Error('Error no definido'));

  const endpoint = error.config?.url || 'URL desconocida';

  if (axios.isAxiosError(error)) {
    const { response, request, code } = error;

    if (code === 'ERR_NETWORK') {
      console.error(`Error de red al llamar a: ${endpoint}`);
      return Promise.reject(new Error('Error de conexión'));
    }

    if (code === 'ERR_CANCELED') {
      console.error(`Conexión cancelada al endpoint: ${endpoint}`);
      return Promise.reject(new Error('Conexión cancelada'));
    }

    if (code === 'ECONNABORTED') {
      console.error(`Timeout en la solicitud al endpoint: ${endpoint}`);
      return Promise.reject(
        new Error('La solicitud tardó demasiado en responder')
      );
    }

    if (response) {
      const status = response.status;
      const errorData = response.data;

      console.error(`Error ${status} en endpoint: ${endpoint}`);
      console.log('Detalles del error:', errorData);

      if (status === 401) return Promise.reject(errorData);

      if (status === 409) return throwServerMessage(error);

      switch (status) {
        case 400:
          return Promise.reject(new Error('Solicitud incorrecta'));
        // case 401:
        //   return Promise.reject(new Error(`No autorizado`));
        case 403:
          return Promise.reject(new Error('Acceso prohibido'));
        case 404:
          return Promise.reject(new Error('No encontrado'));
        case 500:
          return Promise.reject(new Error('Error del servidor'));
        default:
          return Promise.reject(new Error('Error desconocido'));
      }
    }

    if (request) {
      console.error(`Timeout o sin respuesta de: ${endpoint}`);
      return Promise.reject(
        new Error(`Tiempo de espera agotado - ${endpoint}`)
      );
    }

    if (!response && request) {
      console.error(`No hubo respuesta del servidor: ${endpoint}`);
      return Promise.reject(new Error('No hubo respuesta del servidor'));
    }
  }

  console.error(`Error inesperado en: ${endpoint}`);
  return Promise.reject(new Error(`Error inesperado - ${endpoint}`));
};
