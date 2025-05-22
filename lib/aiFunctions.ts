import { HistorialTarifaEntry, HistorialUsuarioEntry, SheetDataPayload } from '../types';
import { HOURS_PER_MONTH_REFERENCE } from '../constants';

/**
 * 🔹 1. calcular_tarifa_sugerida
 * Calcula la tarifa freelance sugerida utilizando la fórmula:
 * Tarifa = PH_mínimo + ((PH_medio - PH_mínimo) × (SPT / 100))
 */
export const calcular_tarifa_sugerida = (
  phMinimo: number,
  phMedio: number,
  spt: number
): number => {
  if (spt < 0 || spt > 100) {
    console.warn('SPT debe estar entre 0 y 100. Usando valor limitado.');
    spt = Math.max(0, Math.min(100, spt));
  }
  // Ensure phMedio is not less than phMinimo for logical calculation
  const effectivePhMedio = Math.max(phMinimo, phMedio);
  return phMinimo + (effectivePhMedio - phMinimo) * (spt / 100);
};

/**
 * 🔹 2. calcular_ph_minimo
 * Calcula el PH_mínimo dividiendo el salario mínimo mensual entre las horas promedio de trabajo al mes (160).
 */
export const calcular_ph_minimo = (
  salarioMinimoMensual: number,
  horasPorMes: number = HOURS_PER_MONTH_REFERENCE
): number => {
  if (salarioMinimoMensual <= 0) {
    console.warn('Salario mínimo mensual debe ser positivo.');
    return 0;
  }
  if (horasPorMes <= 0) {
    console.warn('Horas por mes debe ser positivo. Usando valor por defecto.');
    horasPorMes = HOURS_PER_MONTH_REFERENCE;
  }
  return salarioMinimoMensual / horasPorMes;
};

/**
 * 🔹 3. predecir_tarifa_optima (Placeholder)
 * Analiza combinaciones anteriores de perfiles similares para sugerir un ajuste sobre la tarifa sugerida.
 */
export const predecir_tarifa_optima = (
  // historial: HistorialTarifaEntry[], // Placeholder: data would come from a DB
  spt_actual: number,
  sector_actual: string,
  pais_actual: string
): { ajusteSugerido: number; justificacion: string } => {
  // Placeholder logic:
  // In a real scenario, this would query a database or use a model.
  // For now, returns a minor adjustment or no adjustment.
  console.log('Placeholder predecir_tarifa_optima: No hay datos históricos disponibles.', { spt_actual, sector_actual, pais_actual });
  let ajuste = 0;
  let justificacion = "Función predictiva no implementada (sin datos históricos).";

  if (spt_actual > 80 && (sector_actual.toLowerCase().includes('ia') || sector_actual.toLowerCase().includes('devops'))) {
    ajuste = 0.05; // Suggest a 5% increase for high SPT in high-demand fields
    justificacion = "Perfil alto en sector de alta demanda podría justificar un pequeño extra."
  }

  return {
    ajusteSugerido: ajuste, // e.g., 0.05 for a 5% potential increase factor
    justificacion: justificacion,
  };
};

/**
 * 🔹 4. generar_insight_mercado
 * Crea un insight de mercado en lenguaje natural basado en: País, Sector, PH medio, SPT.
 */
export const generar_insight_mercado = (
  phMedio: number,
  spt: number,
  sector: string,
  pais: string,
  phMinimo: number,
  tshSugerida: number,
  currencySymbol: string
): string => {
  let insight = `En ${pais}, para el sector de ${sector}, la tarifa horaria promedio de mercado (PH Medio) que manejamos es de ${currencySymbol}${phMedio.toFixed(2)}. `;

  if (tshSugerida > phMedio) {
    const diferencia = ((tshSugerida - phMedio) / phMedio) * 100;
    insight += `Con tu perfil (SPT de ${spt}/100), tu tarifa sugerida de ${currencySymbol}${tshSugerida.toFixed(2)} se posiciona un ${diferencia.toFixed(0)}% por encima de este promedio. ¡Excelente! Esto refleja el valor de tu experiencia y habilidades.`;
  } else if (tshSugerida < phMedio) {
    const diferencia = ((phMedio - tshSugerida) / phMedio) * 100;
    if (tshSugerida < phMinimo * 1.1) { // Significantly low
         insight += `Tu tarifa sugerida de ${currencySymbol}${tshSugerida.toFixed(2)} está considerablemente por debajo del promedio del mercado. Aunque partes de una base ética (${currencySymbol}${phMinimo.toFixed(2)}), tu SPT de ${spt}/100 indica que hay un gran potencial para incrementarla y acercarte más al valor de mercado. Considera fortalecer tu portafolio y propuesta de valor.`;
    } else {
        insight += `Tu tarifa sugerida de ${currencySymbol}${tshSugerida.toFixed(2)} está un ${diferencia.toFixed(0)}% por debajo del promedio del mercado. Con un SPT de ${spt}/100, tienes una base sólida. Enfócate en comunicar tu valor para alcanzar tarifas más competitivas.`;
    }
  } else {
    insight += `Tu tarifa sugerida de ${currencySymbol}${tshSugerida.toFixed(2)} está alineada con el promedio del mercado, lo cual es un buen punto de partida para un perfil con un SPT de ${spt}/100.`;
  }
  
  if (spt < 50) {
    insight += " Estás en una etapa de crecimiento; sigue construyendo tu experiencia y portafolio para mejorar tu posicionamiento."
  } else if (spt >= 50 && spt < 80) {
    insight += " Tienes un perfil competitivo. Asegúrate de que tu marketing personal refleje bien tus capacidades."
  } else {
    insight += " Tu perfil es fuerte; no dudes en negociar tarifas que reflejen tu alto valor."
  }

  return insight;
};

/**
 * 🔹 5. ajustar_por_historial (Placeholder)
 * Si el usuario ya ha generado tarifas antes, personaliza el resultado con base en ese historial.
 */
export const ajustar_por_historial = (
  // historialUsuario: HistorialUsuarioEntry[], // Placeholder: data would come from user profile/DB
  nuevaSPT: number
): { factorAjuste: number; mensaje: string } => {
  // Placeholder logic:
  // This would compare nuevaSPT with past SPTs and suggest consistency or growth.
  console.log('Placeholder ajustar_por_historial: No hay historial de usuario disponible.', { nuevaSPT });
  let factor = 1.0;
  let mensaje = "Función de ajuste por historial no implementada (sin datos de usuario).";

  // Example: If new SPT is significantly higher than an imagined "average past SPT"
  // if (historialUsuario.length > 0 && nuevaSPT > (historialUsuario.reduce((a,b) => a + b.sptCalculado, 0) / historialUsuario.length) * 1.1) {
  //   mensaje = "Has mejorado tu perfil notablemente. ¡Considera reflejarlo en tu tarifa!";
  // }
  
  return {
    factorAjuste: factor, // e.g., 1.0 for no change, 1.05 for a slight recommended increase
    mensaje: mensaje,
  };
};

/**
 * Envía datos a una hoja de cálculo de Google Sheets mediante un Webhook.
 */
export const enviar_datos_a_hoja_calculo = async (
  data: SheetDataPayload
): Promise<{ success: boolean; message: string }> => {
  const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzpZyHk_ER6VfM2G9O8RjHGPR87H6GdJKpN60LsSfLo2ejF8kFkqtKl-dJIK_5PDcR8YA/exec';

  // Add a timestamp to the data
  const dataWithTimestamp: SheetDataPayload = {
    ...data,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors', // Required for cross-origin requests to Apps Script web apps run as "user accessing the web app"
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithTimestamp),
    });

    if (response.ok) {
      // Apps Script webhooks usually return a 302 redirect on success if 'doPost' doesn't return ContentService.
      // Or they might return a JSON response if explicitly set up.
      // For simplicity, we'll assume response.ok is sufficient for basic success.
      // You might need to inspect response.text() or response.json() if your Apps Script returns specific data.
      const responseData = await response.json(); // Assuming your Apps Script returns JSON
      console.log('Respuesta de Google Sheets:', responseData);
      if (responseData && responseData.status === 'success') {
        return { success: true, message: 'Datos enviados correctamente a la hoja de cálculo.' };
      } else {
         // If Apps Script doesn't return JSON or a specific success status,
         // we can still consider response.ok as a success.
        if(response.type === 'opaque' || response.redirected){ // Common for simple Apps Script webhooks
            return { success: true, message: 'Datos enviados a la hoja de cálculo (respuesta opaca/redirigida).' };
        }
        return { success: false, message: `Respuesta del servidor no fue de éxito: ${responseData?.message || 'Formato de respuesta inesperado.'}` };
      }
    } else {
      // Handle HTTP errors
      const errorText = await response.text();
      console.error('Error en la respuesta del servidor:', response.status, errorText);
      return { success: false, message: `Error al enviar datos: ${response.status} - ${errorText || response.statusText}` };
    }
  } catch (error) {
    console.error('Error de red al enviar datos a Google Sheets:', error);
    if (error instanceof Error) {
        return { success: false, message: `Error de red: ${error.message}` };
    }
    return { success: false, message: 'Error de red desconocido al enviar datos.' };
  }
};