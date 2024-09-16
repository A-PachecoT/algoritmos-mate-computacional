import numpy as np

def trust_region(f, grad_f, hess_f, x0, delta0=1.0, epsilon=1e-5, max_iter=100):
    x = x0
    delta = delta0
    
    for i in range(max_iter):
        g = grad_f(x)
        H = hess_f(x)
        
        # Resolver subproblema de región de confianza
        p = solve_trust_region_subproblem(g, H, delta)
        
        rho = (f(x) - f(x + p)) / (- np.dot(g, p) - 0.5 * np.dot(p, np.dot(H, p)))
        
        if rho > 0.75:
            delta = min(2*delta, 10)
        elif rho < 0.25:
            delta *= 0.25
        
        if rho > 0.1:
            x = x + p
        
        if np.linalg.norm(g) < epsilon:
            break
    
    return x

def solve_trust_region_subproblem(g, H, delta):
    # Implementación simplificada usando el método de Cauchy point
    p = - (np.dot(g, g) / np.dot(g, np.dot(H, g))) * g
    if np.linalg.norm(p) > delta:
        p = (delta / np.linalg.norm(p)) * p
    return p

# Ejemplo de uso
def f(x):
    return x**3 - x - 2

def grad_f(x):
    return 3*x**2 - 1

def hess_f(x):
    return 6*x

x0 = 1.0
result = trust_region(f, grad_f, hess_f, x0)
print("La raíz aproximada es:", result)