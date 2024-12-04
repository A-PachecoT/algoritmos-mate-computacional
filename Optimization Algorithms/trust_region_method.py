import numpy as np

def trust_region_cauchy(f, grad_f, hess_f, x0, delta0=1.0, epsilon=1e-5, eta=0.1, max_iter=100):
    x = x0
    delta = delta0
    
    for i in range(max_iter):
        g = grad_f(x)
        B = hess_f(x)
        
        # Calcular el Punto de Cauchy
        alpha = min(np.dot(g, g) / np.dot(g, np.dot(B, g)), delta / np.linalg.norm(g))
        p = -alpha * g
        
        # Asegurar que p está dentro de la región de confianza
        if np.linalg.norm(p) > delta:
            p = (delta / np.linalg.norm(p)) * p
        
        # Calcular rho
        rho = (f(x) - f(x + p)) / (- np.dot(g, p) - 0.5 * np.dot(p, np.dot(B, p)))
        
        if rho > eta:
            x = x + p
            if rho > 0.75 and np.linalg.norm(p) == delta:
                delta = min(2*delta, 10)
        else:
            delta *= 0.5
        
        if np.linalg.norm(g) < epsilon:
            break
    
    return x

# Ejemplo de uso
def f(x):
    return x**3 - x - 2

def grad_f(x):
    return 3*x**2 - 1

def hess_f(x):
    return 6*x

x0 = 1.0
result = trust_region_cauchy(f, grad_f, hess_f, x0)
print("La raíz aproximada es:", result)