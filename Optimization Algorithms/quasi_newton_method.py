import numpy as np
from scipy.optimize import minimize

def rosenbrock(x):
    return (1 - x[0])**2 + 100 * (x[1] - x[0]**2)**2

def rosenbrock_grad(x):
    return np.array([-2*(1 - x[0]) - 400*x[0]*(x[1] - x[0]**2),
                     200*(x[1] - x[0]**2)])

x0 = np.array([0, 0])
res = minimize(rosenbrock, x0, method='BFGS', jac=rosenbrock_grad,
               options={'disp': True})

print("Solución óptima:", res.x)
print("Valor mínimo de la función:", res.fun)