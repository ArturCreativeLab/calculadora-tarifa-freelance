
# 💸 Calculadora de Tarifa Freelance y Costes para Clientes – Prototipo v3

Herramienta educativa para estimar tarifas freelance justas y costes de servicios profesionales, desarrollada por Artur Creative Lab.

---

📌 **¿Qué es esta herramienta?**

Esta calculadora es un prototipo funcional diseñado para ayudar a:

*   **Freelancers:** A estimar una tarifa por hora justa y competitiva, basada en su perfil profesional, experiencia, el país donde residen y el sector en el que trabajan.
*   **Clientes:** A obtener una estimación del rango de coste justo para servicios freelance, considerando el tipo de servicio, el nivel de experiencia requerido y el contexto del mercado.

Es una herramienta con un **propósito principalmente educativo y de orientación**, no una solución comercial definitiva. Busca fomentar la transparencia y la confianza en las relaciones profesionales.

---

🧮 **¿Cómo funciona?**

La calculadora utiliza una lógica combinada de datos de mercado y evaluación del perfil del usuario.

**Para Freelancers:**

La tarifa sugerida por hora (TSH) se calcula mediante una fórmula de interpolación lineal:

`TSH = PH_minimo + ((PH_medio - PH_minimo) × (SPT_normalizado / 100))`

Donde:
*   `PH_minimo`: Es el Precio por Hora Mínimo de referencia, calculado a partir del salario mínimo mensual del país del freelancer dividido por un estándar de 160 horas laborales al mes. Representa una base ética para cubrir costes esenciales.
*   `PH_medio`: Es el Precio por Hora Medio estimado en el mercado para el sector y país específicos del freelancer. Este valor se obtiene de una base de datos interna (actualmente con valores de referencia).
*   `SPT_normalizado`: Es la Puntuación de Perfil Total del freelancer (en una escala de 0 a 100) obtenida a través de un test conversacional. Este test evalúa aspectos como experiencia, portafolio, profesionalismo, dominio de herramientas, reputación y propuesta de valor. Una mayor puntuación acerca la tarifa sugerida al `PH_medio` del mercado.

**Para Clientes:**

La estimación de costes se basa en:
*   El `PH_minimo` ético y el `PH_medio` del mercado para el sector y país seleccionados.
*   El nivel de experiencia solicitado para el freelancer (Básico, Profesional, Especializado), que ajusta el rango de tarifas.
*   Factores como la urgencia del proyecto y el volumen de trabajo.

---

🚀 **¿Cómo probarla?**

Esta calculadora es una aplicación frontend estática (HTML, CSS, TypeScript con React) y no requiere un backend complejo.

---

📄 **Características actuales (Versión 1):**

*   **Selector de Rol:** Permite al usuario identificarse como "Freelancer" o "Cliente" para acceder a flujos personalizados.
*   **Flujo Freelancer:**
    *   Selección de país y sector profesional.
    *   Test conversacional de 7 preguntas para evaluar el perfil (SPT).
    *   **Mentor Virtual:** Consejos personalizados basados en la puntuación SPT.
    *   Cálculo de **Tarifa Mínima Ética, Tarifa Sugerida (TSH) y Tarifa Premium** (si SPT > 89).
    *   **Simulador de Presupuesto por Proyecto:** Estima el coste de un proyecto basado en horas y extras.
    *   **Proyección Mensual:** Estima ingresos y horas mensuales basados en proyectos simulados.
    *   **Informe Detallado Copiable:** Texto enriquecido con todos los resultados y recomendaciones.
    *   **Texto Compartible para Redes:** Mensaje breve para compartir el nivel y tarifa.
    *   **Micro-Lecciones:** Tips sobre tarifas, negociación y presupuestos.
*   **Flujo Cliente:**
    *   Selección de país y sector del servicio requerido.
    *   Entrada de nivel de experiencia esperado, urgencia y volumen del proyecto.
    *   Estimación de **Tarifa Mínima Ética y Rango de Tarifa Recomendado** por hora.
    *   Estimación de **Costo Total del Proyecto** si se proporcionan horas.
    *   Consejos educativos para contratar freelancers.
*   **General:**
    *   **Explicación Educativa del Cálculo:** Detalle de cómo se calculan las tarifas y se estiman los rangos.
    *   Mención de **Fuentes de Datos** de referencia.
    *   Diseño ligero, responsivo y accesible.
    *   Interfaz amigable con iconos y feedback visual.
    *   Branding de Artur Creative Lab.

---

🧪 **Sobre Artur Creative Lab**

Este proyecto forma parte del laboratorio de ideas de **Artur Creative Group**. En el Lab, creamos herramientas experimentales, prototipos y contenidos con el objetivo de empoderar a creativos, educadores, profesionales independientes y pequeñas empresas a través de la tecnología y el conocimiento compartido. Buscamos explorar soluciones innovadoras que sean éticas, accesibles y que generen un impacto positivo.

---

📬 **Enlace en vivo**

*   **Puedes probar el prototipo aquí:** [AÑADIR ENLACE DE NETLIFY UNA VEZ DESPLEGADO]

---

📄 **Licencia**

Este proyecto se distribuye bajo la **Licencia MIT**.

Esto significa que eres libre de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, siempre y cuando se incluya el aviso de copyright y esta nota de permiso en todas las copias o porciones sustanciales del software.

El software se proporciona "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.

---

🎯 **Objetivo de este README**

Este documento busca proporcionar una comprensión clara de:
*   Qué es y para qué sirve la Calculadora de Tarifas Freelance v3.
*   Su funcionamiento interno básico.
*   Cómo cualquier persona interesada puede probarla o desplegarla.
*   Su conexión con la misión y los valores de Artur Creative Lab.

¡Gracias por tu interés!
