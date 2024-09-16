def biseccion(f, a, b, epsilon):
    if f(a) * f(b) >= 0:
        print("Bisección método falla.")
        return None

    while abs(b - a) > epsilon:
        c = (a + b) / 2
        if f(c) == 0:
            print("Encontrada raíz exacta.")
            return c
        elif f(a) * f(c) < 0:
            b = c
        else:
            a = c
    return (a + b) / 2

# Ejemplo de uso
def f(x):
    return x**3 - x - 2

a = 1
b = 2
epsilon = 0.001

raiz = biseccion(f, a, b, epsilon)
print("La raíz aproximada es:", raiz)