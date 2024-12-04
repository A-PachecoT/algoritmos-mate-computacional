import numpy as np
from scipy.optimize import line_search

def f(x):
    return (x[0] - 2)**2 + 2*(x[1] - 1)**2

def grad_f(x):
    return np.array([2*(x[0] - 2), 4*(x[1] - 1)])

def bfgs(f, grad_f, x0, max_iter=1000, tol=1e-5):
    n = len(x0)
    x = x0
    B = np.eye(n)  # Inicializar B como la matriz identidad
    
    for i in range(max_iter):
        g = grad_f(x)
        
        if np.linalg.norm(g) < tol:
            print(f"Convergencia alcanzada en {i} iteraciones.")
            break
        
        # Calcular dirección de búsqueda
        d = -np.linalg.solve(B, g)
        
        # Realizar búsqueda lineal
        results = line_search(f, grad_f, x, d)
        if results[0] is not None:
            alpha = results[0]
        else:
            print("La búsqueda lineal falló. Usando un paso fijo.")
            alpha = 0.1  # Usar un paso fijo como alternativa
        
        # Actualizar x
        x_new = x + alpha * d
        
        # Calcular s y y
        s = x_new - x
        y = grad_f(x_new) - g
        
        # Verificar que s y y no sean cero
        if np.all(s == 0) or np.all(y == 0):
            print("s o y es cero. Saltando actualización de B.")
            x = x_new
            continue
        
        # Actualizar B usando la fórmula BFGS
        rho = 1.0 / (y.dot(s))
        if not np.isfinite(rho):
            print("rho no es finito. Saltando actualización de B.")
            x = x_new
            continue
        
        B = (np.eye(n) - rho * np.outer(s, y)).dot(B).dot(np.eye(n) - rho * np.outer(y, s)) + rho * np.outer(s, s)
        
        x = x_new
        
        if i % 10 == 0:
            print(f"Iteración {i}: x = {x}, f(x) = {f(x)}")
    
    return x, f(x)

# Punto inicial
x0 = np.array([0.0, 0.0])

# Ejecutar el algoritmo BFGS
solution, min_value = bfgs(f, grad_f, x0)

print("\nSolución encontrada:")
print(f"x = {solution}")
print(f"f(x) = {min_value}")