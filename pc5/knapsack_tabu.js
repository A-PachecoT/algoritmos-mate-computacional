// Definición de los objetos con su peso y valor
const items = [
  { weight: 10, value: 120 },
  { weight: 20, value: 100 },
  { weight: 30, value: 90 },
];
const capacity = 50; // Capacidad máxima de la mochila

// Parámetros de la búsqueda tabú
const maxIterations = 100; // Número máximo de iteraciones
const tabuSize = 10; // Tamaño de la lista tabú
const neighborhoodSize = 20; // Número de vecinos a explorar por iteración

// Evalúa una solución
function evaluateSolution(solution) {
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

// Genera una solución inicial factible
function generateInitialSolution() {
  const solution = new Array(items.length).fill(0);
  let currentWeight = 0;

  // Intenta agregar items de manera aleatoria mientras sea posible
  for (let i = 0; i < items.length; i++) {
    if (currentWeight + items[i].weight <= capacity && Math.random() > 0.5) {
      solution[i] = 1;
      currentWeight += items[i].weight;
    }
  }

  return solution;
}

// Genera un movimiento (cambio de estado de un item)
function generateMove(solution, index) {
  const newSolution = [...solution];
  newSolution[index] = 1 - newSolution[index];
  return newSolution;
}

// Genera vecinos de la solución actual
function generateNeighbors(currentSolution) {
  const neighbors = [];

  for (let i = 0; i < neighborhoodSize; i++) {
    const index = Math.floor(Math.random() * items.length);
    const neighbor = generateMove(currentSolution, index);
    neighbors.push({
      solution: neighbor,
      index: index,
      value: evaluateSolution(neighbor),
    });
  }

  return neighbors;
}

// Convierte una solución a string para la lista tabú
function solutionToString(solution) {
  return solution.join("");
}

// Algoritmo de búsqueda tabú
function tabuSearch() {
  let currentSolution = generateInitialSolution();
  let bestSolution = [...currentSolution];
  let bestValue = evaluateSolution(currentSolution);

  const tabuList = new Set(); // Lista tabú implementada como un Set

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const neighbors = generateNeighbors(currentSolution);

    // Ordena vecinos por valor
    neighbors.sort((a, b) => b.value - a.value);

    // Encuentra el mejor vecino no tabú
    let selectedNeighbor = null;
    for (const neighbor of neighbors) {
      const neighborString = solutionToString(neighbor.solution);
      if (!tabuList.has(neighborString)) {
        selectedNeighbor = neighbor;
        break;
      }
    }

    if (!selectedNeighbor) continue;

    // Actualiza la solución actual
    currentSolution = selectedNeighbor.solution;

    // Actualiza la mejor solución si es necesario
    const currentValue = selectedNeighbor.value;
    if (currentValue > bestValue) {
      bestSolution = [...currentSolution];
      bestValue = currentValue;
    }

    // Actualiza la lista tabú
    tabuList.add(solutionToString(currentSolution));
    if (tabuList.size > tabuSize) {
      const firstItem = tabuList.values().next().value;
      tabuList.delete(firstItem);
    }
  }

  return {
    solution: bestSolution,
    value: bestValue,
  };
}

module.exports = { tabuSearch };

// Ejecutar solo si es llamado directamente
if (require.main === module) {
    console.log("Ejecutando Búsqueda Tabú...\n");
    const result = tabuSearch();
    const solution = result.solution;
    
    // Calcular y mostrar resultados
    let totalWeight = 0;
    let totalValue = 0;
    
    console.log("🎯 SOLUCIÓN ENCONTRADA:")
    console.log("▔".repeat(40))
    console.log("Vector solución:", solution)
    
    console.log("\n📦 ITEMS SELECCIONADOS:")
    console.log("▔".repeat(40))
    solution.forEach((selected, index) => {
        if (selected === 1) {
            console.log(`Item ${index + 1}:`)
            console.log(`  Peso: ${items[index].weight}kg`)
            console.log(`  Valor: $${items[index].value}`)
            console.log(`  Ratio: ${(items[index].value/items[index].weight).toFixed(2)} $/kg`)
            totalWeight += items[index].weight;
            totalValue += items[index].value;
        }
    });
    
    console.log("\n📊 RESUMEN:")
    console.log("▔".repeat(40))
    console.log(`Peso total: ${totalWeight}/${capacity}kg`)
    console.log(`Valor total: $${totalValue}`)
    console.log(`Ratio de utilización: ${((totalWeight/capacity) * 100).toFixed(2)}%`)
    console.log(`Eficiencia: ${(totalValue/capacity).toFixed(2)} $/kg`)
    
    console.log("\n⚙️ PARÁMETROS UTILIZADOS:")
    console.log("▔".repeat(40))
    console.log(`Tamaño de lista tabú: ${tabuSize}`)
    console.log(`Iteraciones máximas: ${maxIterations}`)
    console.log(`Tamaño del vecindario: ${neighborhoodSize}`)
}
