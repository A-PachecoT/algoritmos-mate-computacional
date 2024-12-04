// Parámetros del algoritmo GRASP
const maxIterations = 20; // Reducido de 100 a 20
const alpha = 0.3; // Factor de relajación para la lista RCL
const maxLocalSearchSteps = 100; // Límite de pasos en búsqueda local

// Calcula la ratio valor/peso para cada item
function calculateRatios() {
  if (!global.items || !global.capacity) {
    throw new Error("Items y capacity deben estar definidos");
  }
  return global.items.map((item, index) => ({
    index,
    ratio: item.value / item.weight,
    weight: item.weight,
    value: item.value,
  }));
}

// Construye la Lista de Candidatos Restringida (RCL)
function buildRCL(candidates, currentWeight) {
  // Filtra items que no excedan la capacidad
  const feasibleItems = candidates.filter(
    (item) => currentWeight + item.weight <= global.capacity
  );

  if (feasibleItems.length === 0) return [];

  // Ordena por ratio de mayor a menor
  feasibleItems.sort((a, b) => b.ratio - a.ratio);

  // Calcula valores límite para la RCL
  const maxRatio = feasibleItems[0].ratio;
  const minRatio = feasibleItems[feasibleItems.length - 1].ratio;
  const threshold = maxRatio - alpha * (maxRatio - minRatio);

  // Construye RCL con items que cumplan el criterio
  return feasibleItems.filter((item) => item.ratio >= threshold);
}

// Fase constructiva: construye una solución inicial de manera golosa aleatorizada
function constructivePhase() {
  const solution = new Array(global.items.length).fill(0);
  let currentWeight = 0;
  let candidates = calculateRatios();
  let remainingCandidates = [...candidates];

  while (remainingCandidates.length > 0) {
    const rcl = buildRCL(remainingCandidates, currentWeight);
    if (rcl.length === 0) break;

    // Selecciona un elemento aleatorio de la RCL
    const selectedIndex = Math.floor(Math.random() * rcl.length);
    const selectedItem = rcl[selectedIndex];

    // Actualiza la solución
    solution[selectedItem.index] = 1;
    currentWeight += selectedItem.weight;

    // Actualiza la lista de candidatos
    remainingCandidates = remainingCandidates.filter(
      (item) => item.index !== selectedItem.index
    );
  }

  return solution;
}

// Evalúa una solución
function evaluateSolution(solution) {
  let totalWeight = 0;
  let totalValue = 0;

  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === 1) {
      totalWeight += global.items[i].weight;
      totalValue += global.items[i].value;
    }
  }

  return totalWeight <= global.capacity ? totalValue : 0;
}

// Fase de búsqueda local optimizada: limita el número de intentos
function localSearch(solution) {
  let improved = true;
  let bestSolution = [...solution];
  let bestValue = evaluateSolution(solution);
  let steps = 0;

  while (improved && steps < maxLocalSearchSteps) {
    improved = false;
    steps++;

    // Intentar un número limitado de intercambios aleatorios
    for (let attempt = 0; attempt < 20; attempt++) {
      // Seleccionar dos posiciones aleatorias
      const i = Math.floor(Math.random() * solution.length);
      const j = Math.floor(Math.random() * solution.length);

      if (i === j) continue;

      const newSolution = [...bestSolution];
      newSolution[i] = 1 - newSolution[i];
      newSolution[j] = 1 - newSolution[j];

      const newValue = evaluateSolution(newSolution);

      if (newValue > bestValue) {
        bestSolution = newSolution;
        bestValue = newValue;
        improved = true;
        break; // Salir al encontrar una mejora
      }
    }
  }

  return bestSolution;
}

// Algoritmo GRASP principal
function graspAlgorithm() {
  let bestSolution = null;
  let bestValue = 0;

  for (let i = 0; i < maxIterations; i++) {
    // Fase constructiva
    const initialSolution = constructivePhase();

    // Fase de búsqueda local
    const improvedSolution = localSearch(initialSolution);
    const currentValue = evaluateSolution(improvedSolution);

    // Actualiza la mejor solución si es necesario
    if (currentValue > bestValue) {
      bestSolution = improvedSolution;
      bestValue = currentValue;
    }
  }

  return {
    solution: bestSolution,
    value: bestValue,
  };
}

module.exports = { graspAlgorithm };

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  console.log("Ejecutando Algoritmo GRASP...\n");
  const result = graspAlgorithm();
  const solution = result.solution;

  // Calcular y mostrar resultados
  let totalWeight = 0;
  let totalValue = 0;

  console.log("🎯 SOLUCIÓN ENCONTRADA:");
  console.log("▔".repeat(40));
  console.log("Vector solución:", solution);

  console.log("\n📦 ITEMS SELECCIONADOS:");
  console.log("▔".repeat(40));
  solution.forEach((selected, index) => {
    if (selected === 1) {
      console.log(`Item ${index + 1}:`);
      console.log(`  Peso: ${global.items[index].weight}kg`);
      console.log(`  Valor: $${global.items[index].value}`);
      console.log(
        `  Ratio: ${(
          global.items[index].value / global.items[index].weight
        ).toFixed(2)} $/kg`
      );
      totalWeight += global.items[index].weight;
      totalValue += global.items[index].value;
    }
  });

  console.log("\n📊 RESUMEN:");
  console.log("▔".repeat(40));
  console.log(`Peso total: ${totalWeight}/${global.capacity}kg`);
  console.log(`Valor total: $${totalValue}`);
  console.log(
    `Ratio de utilización: ${((totalWeight / global.capacity) * 100).toFixed(
      2
    )}%`
  );
  console.log(`Eficiencia: ${(totalValue / global.capacity).toFixed(2)} $/kg`);

  console.log("\n⚙️ PARÁMETROS UTILIZADOS:");
  console.log("▔".repeat(40));
  console.log(`Alpha: ${alpha} (factor de relajación)`);
  console.log(`Iteraciones: ${maxIterations}`);
}
