import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def himmelblau(x, y):
    return (x**2 + y - 11)**2 + (x + y**2 - 7)**2

def hooke_jeeves(f, x0, delta=1.0, epsilon=1e-8, alpha=0.5, max_iter=10000):
    x = np.array(x0, dtype=float)
    n = len(x)
    f_x = f(*x)
    
    for k in range(max_iter):
        improved = False
        y = x.copy()
        
        for i in range(n):
            for sign in [1, -1]:
                y_temp = y.copy()
                y_temp[i] += sign * delta
                f_y_temp = f(*y_temp)
                if f_y_temp < f_x:
                    y = y_temp
                    f_x = f_y_temp
                    improved = True
                    break
            if improved:
                break
        
        if improved:
            x_new = x + 2 * (y - x)
            f_x_new = f(*x_new)
            if f_x_new < f_x:
                x = x_new
                f_x = f_x_new
            else:
                x = y
        else:
            delta *= alpha
        
        if delta < epsilon:
            break
    
    return x

# Generar puntos para la gráfica
x = np.linspace(-6, 6, 100)
y = np.linspace(-6, 6, 100)
X, Y = np.meshgrid(x, y)
Z = himmelblau(X, Y)

# Encontrar soluciones con diferentes puntos iniciales
initial_points = [(0, 0), (1, 1), (-2, 2), (3, -2)]
solutions = [hooke_jeeves(himmelblau, point) for point in initial_points]

# Crear gráfica 2D (mapa de contorno)
plt.figure(figsize=(12, 10))
plt.contour(X, Y, Z, levels=np.logspace(0, 3, 20))
plt.colorbar(label='f(x, y)')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Mapa de contorno de la función de Himmelblau')

# Marcar soluciones encontradas
for sol in solutions:
    plt.plot(sol[0], sol[1], 'r*', markersize=15)

# Marcar puntos iniciales
for point in initial_points:
    plt.plot(point[0], point[1], 'go', markersize=10)

plt.legend(['Soluciones', 'Puntos iniciales'])
plt.savefig('himmelblau_contour.png')
plt.close()

# Crear gráfica 3D
fig = plt.figure(figsize=(12, 10))
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(X, Y, Z, cmap='viridis', alpha=0.8)
ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('f(x, y)')
ax.set_title('Superficie 3D de la función de Himmelblau')

# Marcar soluciones encontradas
for sol in solutions:
    ax.scatter(sol[0], sol[1], himmelblau(*sol), c='r', s=100, marker='*')

# Marcar puntos iniciales
for point in initial_points:
    ax.scatter(point[0], point[1], himmelblau(*point), c='g', s=100, marker='o')

plt.savefig('himmelblau_3d.png')
plt.close()

print("Soluciones encontradas:")
for i, sol in enumerate(solutions):
    print(f"Desde {initial_points[i]}: {sol}, f(x,y) = {himmelblau(*sol)}")