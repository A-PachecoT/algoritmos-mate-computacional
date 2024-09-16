import numpy as np

def conjugate_gradient(A, b, x0, epsilon=1e-6, max_iter=1000):
    x = x0
    r = b - A.dot(x)
    p = r.copy()
    r_norm_sq = r.dot(r)
    
    for i in range(max_iter):
        Ap = A.dot(p)
        alpha = r_norm_sq / p.dot(Ap)
        x += alpha * p
        r -= alpha * Ap
        r_norm_sq_new = r.dot(r)
        if np.sqrt(r_norm_sq_new) < epsilon:
            break
        beta = r_norm_sq_new / r_norm_sq
        p = r + beta * p
        r_norm_sq = r_norm_sq_new
    
    return x

# Ejemplo de uso
A = np.array([[2, -1], [-1, 2]])
b = np.array([1, 0])
x0 = np.zeros(2)

solution = conjugate_gradient(A, b, x0)
print("Solución:", solution)