# Playwright Automation Exercise

Este repositorio contiene pruebas automatizadas con Playwright basadas en los casos de prueba de [Automation Exercise](https://www.automationexercise.com/test_cases).

## Descripción

El objetivo de este proyecto es validar la funcionalidad de la plataforma Automation Exercise mediante pruebas automatizadas, asegurando que los flujos principales operen correctamente en distintos navegadores.

## Casos de prueba automatizados

Este proyecto cubre los siguientes casos de prueba disponibles en Automation Exercise:

### Casos de prueba completados ✅

1. Registrar usuario
2. Iniciar sesión de usuario con correo electrónico y contraseña correctos
3. Iniciar sesión de usuario con correo electrónico y contraseña incorrectos
4. Cerrar sesión de usuario
5. Registrar usuario con correo electrónico existente

### Casos de prueba en desarrollo 🚧

6. Formulario de contacto
7. Verificar página de casos de prueba
8. Verificar todos los productos y página de detalles del producto
9. Buscar producto
10. Verificar suscripción en la página de inicio
11. Verificar suscripción en la página del carrito
12. Agregar productos al carrito
13. Verificar cantidad de productos en el carrito
14. Realizar pedido: Registrarse durante el pago
15. Realizar pedido: Registrarse antes del pago
16. Realizar pedido: Iniciar sesión antes del pago
17. Eliminar productos del carrito
18. Ver productos de la categoría
19. Ver y agregar marca al carrito Productos
20. Buscar productos y verificar el carrito después de iniciar sesión
21. Agregar una reseña sobre el producto
22. Agregar al carrito desde los artículos recomendados
23. Verificar los detalles de la dirección en la página de pago
24. Descargar la factura después de la orden de compra
25. Verificar el desplazamiento hacia arriba con el botón de "Flecha" y la funcionalidad de desplazamiento hacia abajo
26. Verificar el desplazamiento hacia arriba sin el botón de "Flecha" y la funcionalidad de desplazamiento hacia abajo

📌 Los archivos de prueba están ubicados en la carpeta /tests.

## Configuración

### Requisitos

- Node.js (versión LTS recomendada)
- Navegadores soportados por Playwright

### Instalación

1. Clona el repositorio:
   
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   
   ```sh
   npm ci
   ```
3. Instala los navegadores necesarios para Playwright:
   
   ```sh
   npx playwright install --with-deps
   ```
   
   ## Ejecución de Pruebas
   
   Para ejecutar las pruebas, utiliza el siguiente comando:
   
   ```sh
   npx playwright test
   ```
   
   ## Configuración de Playwright
   
   La configuración de Playwright se encuentra en el archivo ``playwright.config.ts`` Aquí puedes ajustar parámetros como el directorio de pruebas, el número de reintentos, el número de trabajadores, y más.

## Estructura de Pruebas

Las pruebas están organizadas en el directorio ``tests`` y se dividen en diferentes archivos según el tipo de pruebas:

- ``PruebasPaginas.spec.ts``: Pruebas de gestión de usuario (casos 6, 7, 25, 26).
- ``PruebasTienda.spec.ts``: Pruebas de gestión de usuario (casos 8-24).
- ``PruebasUsuario.spec.ts``: Pruebas de gestión de usuario (casos 1-5).

## Resultados de las Pruebas

Los resultados de las pruebas se almacenan en el directorio ``test-results`` y los reportes HTML se generan en el directorio ``playwright-report``.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría realizar.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.