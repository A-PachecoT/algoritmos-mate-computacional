const { geneticAlgorithm } = require("./knapsack_genetico.js");
const { graspAlgorithm } = require("./knapsack_grasp.js");

// Generador de items aleatorios
function generateItems(size) {
  return Array.from({ length: size }, (_, index) => ({
    weight: Math.floor(Math.random() * 30) + 1, // Peso entre 1 y 30
    value: Math.floor(Math.random() * 200) + 50, // Valor entre 50 y 250
  }));
}

// Función para evaluar la calidad de una solución
function evaluateSolution(solution, items, capacity) {
  let totalWeight = 0;
  let totalValue = 0;

  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === 1) {
      totalWeight += items[i].weight;
      totalValue += items[i].value;
    }
  }

  return totalWeight <= capacity ? totalValue : 0;
}

// Función para medir el rendimiento
function measurePerformance(algorithm, items, capacity) {
  const NUM_RUNS = 5; // Número de ejecuciones para promediar
  let times = [];
  let solutions = [];

  // Configurar variables globales
  global.items = items;
  global.capacity = capacity;

  // Calentar el JIT
  for (let i = 0; i < 3; i++) {
    algorithm(items, capacity);
  }

  // Realizar múltiples mediciones
  for (let i = 0; i < NUM_RUNS; i++) {
    const startTime = process.hrtime();
    const result = algorithm(items, capacity);
    const endTime = process.hrtime(startTime);
    times.push(endTime[0] * 1000 + endTime[1] / 1000000);
    solutions.push(result.value); // Usar el valor retornado por el algoritmo
  }

  // Eliminar valores extremos y promediar tiempos
  times.sort((a, b) => a - b);
  times = times.slice(1, -1);
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

  // Calcular calidad promedio de soluciones
  const avgQuality = solutions.reduce((a, b) => a + b, 0) / solutions.length;

  return {
    time: avgTime,
    quality: avgQuality,
  };
}

function runPerformanceTests() {
  // Tamaños más manejables
  const problemSizes = [50, 100, 200, 500];
  const results = [];

  for (const size of problemSizes) {
    console.log(`\n🔄 Ejecutando pruebas con ${size} items...`);

    // Generar nuevo conjunto de items
    const items = generateItems(size);
    const capacity = Math.floor(size * 10);

    // Medir rendimiento de cada algoritmo
    const geneticResult = measurePerformance(geneticAlgorithm, items, capacity);
    const graspResult = measurePerformance(graspAlgorithm, items, capacity);

    results.push({
      size,
      genetic: geneticResult,
      grasp: graspResult,
    });
  }

  return results;
}

function displayPerformanceResults(results) {
  console.clear();
  console.log("\n🎯 COMPARACIÓN: ALGORITMO GENÉTICO VS GRASP");
  console.log("═".repeat(80));

  // Tabla comparativa principal
  console.log("\n📊 RENDIMIENTO POR TAMAÑO:");
  console.log("─".repeat(80));
  console.log(
    "Tamaño".padEnd(10) +
      "│ " +
      "Tiempo Gen.".padEnd(12) +
      "│ " +
      "Tiempo GRASP".padEnd(12) +
      "│ " +
      "Valor Gen.".padEnd(12) +
      "│ " +
      "Valor GRASP".padEnd(12) +
      "│ " +
      "Ganador"
  );
  console.log("─".repeat(80));

  results.forEach((result) => {
    const timeWinner =
      result.genetic.time > result.grasp.time ? "GRASP" : "Genético";
    const timeRatio =
      Math.max(result.genetic.time, result.grasp.time) /
      Math.min(result.genetic.time, result.grasp.time);

    const qualityWinner =
      result.genetic.quality > result.grasp.quality ? "Genético" : "GRASP";
    const qualityRatio =
      Math.max(result.genetic.quality, result.grasp.quality) /
      Math.min(result.genetic.quality, result.grasp.quality);

    console.log(
      `${result.size}`.padEnd(10) +
        "│ " +
        `${result.genetic.time.toFixed(1)}ms`.padEnd(12) +
        "│ " +
        `${result.grasp.time.toFixed(1)}ms`.padEnd(12) +
        "│ " +
        `$${result.genetic.quality.toFixed(0)}`.padEnd(12) +
        "│ " +
        `$${result.grasp.quality.toFixed(0)}`.padEnd(12) +
        "│ " +
        `${timeWinner} (${timeRatio.toFixed(1)}x más rápido)`
    );
    console.log(
      " ".padEnd(10) +
        "│ " +
        " ".padEnd(12) +
        "│ " +
        " ".padEnd(12) +
        "│ " +
        " ".padEnd(12) +
        "│ " +
        " ".padEnd(12) +
        "│ " +
        `${qualityWinner} (${qualityRatio.toFixed(1)}x mejor valor)`
    );
    console.log("─".repeat(80));
  });

  // Resumen
  console.log("\n📈 RESUMEN:");
  console.log("─".repeat(80));

  // Contar victorias (tiempo y calidad)
  const victories = results.reduce((acc, result) => {
    // Victorias en tiempo
    if (result.genetic.time < result.grasp.time)
      acc.timeGenetic = (acc.timeGenetic || 0) + 1;
    else acc.timeGrasp = (acc.timeGrasp || 0) + 1;

    // Victorias en calidad
    if (result.genetic.quality > result.grasp.quality)
      acc.qualityGenetic = (acc.qualityGenetic || 0) + 1;
    else acc.qualityGrasp = (acc.qualityGrasp || 0) + 1;

    return acc;
  }, {});

  console.log("En velocidad:");
  console.log(`• Genético ganó en ${victories.timeGenetic || 0} tamaños`);
  console.log(`• GRASP ganó en ${victories.timeGrasp || 0} tamaños`);

  console.log("\nEn calidad de solución:");
  console.log(`• Genético ganó en ${victories.qualityGenetic || 0} tamaños`);
  console.log(`• GRASP ganó en ${victories.qualityGrasp || 0} tamaños`);

  // Análisis de escalabilidad
  const firstSize = results[0].size;
  const lastSize = results[results.length - 1].size;
  const sizeIncrease = lastSize / firstSize;

  const timeIncreaseGenetic =
    results[results.length - 1].genetic.time / results[0].genetic.time;
  const timeIncreaseGrasp =
    results[results.length - 1].grasp.time / results[0].grasp.time;

  console.log(`\n📊 ESCALABILIDAD (de ${firstSize} a ${lastSize} items):`);
  console.log("─".repeat(80));
  console.log(`• Tamaño del problema aumentó ${sizeIncrease}x`);
  console.log(`• Tiempo Genético aumentó ${timeIncreaseGenetic.toFixed(1)}x`);
  console.log(`• Tiempo GRASP aumentó ${timeIncreaseGrasp.toFixed(1)}x`);

  if (timeIncreaseGenetic < timeIncreaseGrasp) {
    console.log("\n✓ El algoritmo Genético escala mejor con el tamaño");
  } else {
    console.log("\n✓ GRASP escala mejor con el tamaño");
  }

  console.log("\n" + "═".repeat(80));
}

// Ejecutar pruebas de rendimiento
console.log("Ejecutando pruebas de rendimiento...\n");
const performanceResults = runPerformanceTests();
displayPerformanceResults(performanceResults);
