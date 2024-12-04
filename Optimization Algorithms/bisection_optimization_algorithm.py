def biseccion_optimizacion(f, a, b, epsilon):
    while b - a > epsilon:
        m = (a + b) / 2
        x1 = (a + m) / 2
        x2 = (m + b) / 2
        if f(x1) < f(m):
            b = m
        elif f(x2) < f(m):
            a = m
        else:
            a, b = x1, x2
    return (a + b) / 2

# Ejemplo de uso
def f(x):
    return (x - 2)**2 + 1

a = 0
b = 3
epsilon = 0.001
minimo = biseccion_optimizacion(f, a, b, epsilon)
print("El punto mínimo aproximado es:", minimo)
print("El valor mínimo aproximado es:", f(minimo))