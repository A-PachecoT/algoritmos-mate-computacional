// Definición de los objetos con su peso y valor
const items = [
  { weight: 10, value: 120 },
  { weight: 20, value: 100 },
  { weight: 30, value: 90 },
];
const capacity = 50; // Capacidad máxima de la mochila

// Parámetros del algoritmo genético
const populationSize = 20; // Tamaño de la población
const generations = 100; // Número de generaciones
const mutationRate = 0.1; // Tasa de mutación

// Calcula el valor total de una solución respetando la restricción de peso
function calculateFitness(chromosome) {
  let totalWeight = 0;
  let totalValue = 0;

  for (let i = 0; i < chromosome.length; i++) {
    if (chromosome[i] === 1) {
      totalWeight += global.items[i].weight;
      totalValue += global.items[i].value;
    }
  }

  return totalWeight > global.capacity ? 0 : totalValue;
}

// Genera un cromosoma aleatorio (solución inicial)
function generateRandomChromosome() {
  return Array.from({ length: global.items.length }, () =>
    Math.random() > 0.5 ? 1 : 0
  );
}

// Selecciona un individuo mediante torneo
function select(population) {
  const tournamentSize = 3; // Tamaño del torneo
  let best = population[Math.floor(Math.random() * population.length)];
  for (let i = 1; i < tournamentSize; i++) {
    const contender = population[Math.floor(Math.random() * population.length)];
    if (calculateFitness(contender) > calculateFitness(best)) {
      best = contender;
    }
  }
  return best;
}

// Realiza el cruce entre dos padres para generar dos hijos
function crossover(parent1, parent2) {
  const point = Math.floor(Math.random() * parent1.length);
  const child1 = parent1.slice(0, point).concat(parent2.slice(point));
  const child2 = parent2.slice(0, point).concat(parent1.slice(point));
  return [child1, child2];
}

// Aplica mutación a un cromosoma
function mutate(chromosome) {
  return chromosome.map((gene) =>
    Math.random() < mutationRate ? 1 - gene : gene
  );
}

// Función principal del algoritmo genético
function geneticAlgorithm() {
  if (!global.items || !global.capacity) {
    throw new Error("Items y capacity deben estar definidos");
  }

  // Inicializa la población con soluciones aleatorias
  let population = Array.from(
    { length: populationSize },
    generateRandomChromosome
  );

  for (let generation = 0; generation < generations; generation++) {
    // Ordena la población por fitness
    population = population.sort(
      (a, b) => calculateFitness(b) - calculateFitness(a)
    );

    const newPopulation = [];

    // Genera nueva población mediante selección, cruce y mutación
    while (newPopulation.length < populationSize) {
      const parent1 = select(population);
      const parent2 = select(population);

      const [child1, child2] = crossover(parent1, parent2);

      newPopulation.push(mutate(child1));
      if (newPopulation.length < populationSize) {
        newPopulation.push(mutate(child2));
      }
    }

    population = newPopulation;
  }

  // Obtiene la mejor solución
  population = population.sort(
    (a, b) => calculateFitness(b) - calculateFitness(a)
  );
  const bestSolution = population[0];
  return {
    solution: bestSolution,
    value: calculateFitness(bestSolution),
  };
}

module.exports = { geneticAlgorithm };

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  console.log("Ejecutando Algoritmo Genético...\n");
  const solution = geneticAlgorithm();

  // Calcular y mostrar resultados
  let totalWeight = 0;
  let totalValue = 0;

  console.log("🧬 SOLUCIÓN ENCONTRADA:");
  console.log("▔".repeat(40));
  console.log("Vector solución:", solution.solution);

  console.log("\n📦 ITEMS SELECCIONADOS:");
  console.log("▔".repeat(40));
  solution.solution.forEach((selected, index) => {
    if (selected === 1) {
      console.log(`Item ${index + 1}:`);
      console.log(`  Peso: ${items[index].weight}kg`);
      console.log(`  Valor: $${items[index].value}`);
      console.log(
        `  Ratio: ${(items[index].value / items[index].weight).toFixed(2)} $/kg`
      );
      totalWeight += items[index].weight;
      totalValue += items[index].value;
    }
  });

  console.log("\n📊 RESUMEN:");
  console.log("▔".repeat(40));
  console.log(`Peso total: ${totalWeight}/${capacity}kg`);
  console.log(`Valor total: $${totalValue}`);
  console.log(
    `Ratio de utilización: ${((totalWeight / capacity) * 100).toFixed(2)}%`
  );
  console.log(`Eficiencia: ${(totalValue / capacity).toFixed(2)} $/kg`);
}
