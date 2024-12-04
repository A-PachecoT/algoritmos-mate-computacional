import numpy as np

def hooke_jeeves(f, x0, delta=1.0, epsilon=1e-8, alpha=0.5, max_iter=10000):
    """
    Implementación del método de Hooke-Jeeves para optimización sin restricciones.
    
    Parámetros:
    f : función objetivo
    x0 : punto inicial (lista o array)
    delta : tamaño inicial del paso
    epsilon : tolerancia para la convergencia
    alpha : factor de reducción del tamaño del paso
    max_iter : número máximo de iteraciones
    
    Retorna:
    x : solución aproximada
    """
    x = np.array(x0, dtype=float)
    n = len(x)
    f_x = f(x)
    
    for k in range(max_iter):
        improved = False
        y = x.copy()
        
        # Movimiento exploratorio
        for i in range(n):
            for sign in [1, -1]:
                y_temp = y.copy()
                y_temp[i] += sign * delta
                f_y_temp = f(y_temp)
                if f_y_temp < f_x:
                    y = y_temp
                    f_x = f_y_temp
                    improved = True
                    break  # Acepta la mejora inmediatamente
            if improved:
                break  # Pasa a la siguiente variable si hubo mejora
        
        if improved:
            # Movimiento de patrón
            x_new = x + 2 * (y - x)
            f_x_new = f(x_new)
            if f_x_new < f_x:
                x = x_new
                f_x = f_x_new
            else:
                x = y
        else:
            # Reducir el tamaño del paso
            delta *= alpha
        
        # Verificar convergencia
        if delta < epsilon:
            break
    
    return x

# Ejemplo de uso con la función de Himmelblau
def himmelblau(x):
    return (x[0]**2 + x[1] - 11)**2 + (x[0] + x[1]**2 - 7)**2

# Punto inicial
x0 = [0, 0]

# Ejecutar el algoritmo
result = hooke_jeeves(himmelblau, x0)

print("Solución encontrada:", result)
print("Valor de la función en la solución:", himmelblau(result))

# Verificar los mínimos conocidos de la función de Himmelblau
minima = [
    (3.0, 2.0),
    (-2.805118, 3.131312),
    (-3.779310, -3.283186),
    (3.584428, -1.848126)
]

print("\nMínimos conocidos de la función de Himmelblau:")
for m in minima:
    print(f"En {m}: {himmelblau(m)}")