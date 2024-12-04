# Análisis Comparativo: GRASP vs Algoritmo Genético
## Problema de la Mochila (Knapsack Problem)

Este repositorio contiene una implementación y análisis comparativo de dos metaheurísticas aplicadas al problema de la mochila:
- GRASP (Greedy Randomized Adaptive Search Procedure)
- Algoritmo Genético

### Complejidad Algorítmica

#### GRASP
- **Fase Constructiva**: O(n log n) debido al ordenamiento inicial por ratio valor/peso
- **Fase de Búsqueda Local**: O(n²) en el peor caso al examinar pares de elementos
- **Complejidad Total**: O(n²) por iteración
- **Espacio**: O(n) para almacenar la solución y la lista RCL

#### Algoritmo Genético
- **Evaluación de Fitness**: O(n) por individuo
- **Selección**: O(k) donde k es el tamaño del torneo
- **Cruce y Mutación**: O(n) por individuo
- **Complejidad Total**: O(g × p × n) donde:
  - g = número de generaciones
  - p = tamaño de la población
  - n = número de items
- **Espacio**: O(p × n) para almacenar la población

### Resultados Experimentales

Los experimentos se realizaron con diferentes tamaños de entrada:
- Tamaños probados: 50, 100, 200 y 500 items
- Múltiples ejecuciones por tamaño
- Medición de tiempo y calidad de solución

#### Calidad de las Soluciones
- GRASP consistentemente encuentra mejores soluciones
- Mejora de 1.2x a 1.4x en valor respecto al genético
- GRASP ganó en calidad en todos los tamaños probados

#### Tiempo de Ejecución
- **Problemas pequeños (50-100 items)**:
  - GRASP es más rápido
  - Hasta 2.8x más rápido en instancias pequeñas
- **Problemas grandes (200-500 items)**:
  - El genético es más rápido
  - Hasta 5.1x más rápido en instancias grandes

#### Escalabilidad
Al aumentar el tamaño del problema 10 veces (50 a 500 items):
- Tiempo Genético: aumentó 8.2x (casi lineal)
- Tiempo GRASP: aumentó 117.6x (más que cuadrático)

### Trade-offs y Conclusiones

1. **GRASP**
   - ✅ Mejor calidad de soluciones
   - ✅ Más rápido en problemas pequeños
   - ❌ Escalabilidad limitada
   - ❌ Tiempo crece cuadráticamente

2. **Algoritmo Genético**
   - ✅ Mejor escalabilidad
   - ✅ Más rápido en problemas grandes
   - ❌ Soluciones de menor calidad
   - ❌ Requiere más memoria

### Recomendaciones de Uso

- **Usar GRASP cuando**:
  - La calidad de la solución es crítica
  - El tamaño del problema es pequeño-mediano (<200 items)
  - El tiempo de ejecución no es crítico

- **Usar Algoritmo Genético cuando**:
  - El tiempo de ejecución es crítico
  - El tamaño del problema es grande (>200 items)
  - Se pueden aceptar soluciones sub-óptimas

### Implementación

El código fuente incluye:
- `knapsack_grasp.js`: Implementación de GRASP
- `knapsack_genetico.js`: Implementación del Algoritmo Genético
- `comparacion.js`: Script de comparación y benchmarking 