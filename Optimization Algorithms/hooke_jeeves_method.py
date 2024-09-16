import numpy as np

def hooke_jeeves(f, x0, delta=0.5, epsilon=1e-6, alpha=0.5, max_iter=1000):
    x = np.array(x0)
    n = len(x)
    
    for k in range(max_iter):
        y = x.copy()
        improved = False
        
        # Movimiento exploratorio
        for i in range(n):
            for sign in [1, -1]:
                y[i] = x[i] + sign * delta
                if f(y) < f(x):
                    improved = True
                    break
            if improved:
                break
            y[i] = x[i]
        
        if improved:
            # Movimiento de patrón
            x_new = x + (y - x) * 2
            if f(x_new) < f(y):
                x = x_new
            else:
                x = y
        else:
            delta *= alpha
        
        if delta < epsilon:
            break
    
    return x

# Ejemplo de uso
def himmelblau(x):
    return (x[0]**2 + x[1] - 11)**2 + (x[0] + x[1]**2 - 7)**2

x0 = [0, 0]
result = hooke_jeeves(himmelblau, x0)
print("Solución encontrada:", result)
print("Valor de la función:", himmelblau(result))