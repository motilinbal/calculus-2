import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider

# --- Configuration ---
# 1. Define the function to integrate
def func(x):
    # Example function: f(x) = x^2 + 1
    # return x**2 + 1
    # Another example: f(x) = sin(x) + 1.5
    return np.sin(x) + 1.5
    # Another example: f(x) = 4 - x^2
    # return 4 - x**2

# 2. Define the interval [a, b]
a = 0
b = 5

# 3. Define the initial and maximum number of partitions
initial_n = 5
max_n = 100
# --- End Configuration ---

# Create the figure and axes
fig, ax = plt.subplots(figsize=(10, 7))
plt.subplots_adjust(left=0.1, bottom=0.25) # Adjust layout to make room for slider

# Plot the function curve
x_curve = np.linspace(a, b, 400)
y_curve = func(x_curve)
line, = ax.plot(x_curve, y_curve, 'b-', linewidth=2, label='$f(x)$')

# Set plot limits and labels
y_min = np.min(y_curve) - 0.5
y_max = np.max(y_curve) + 0.5
# Adjust y_min if function can be negative to ensure rectangles start from 0 if needed
# y_min = min(0, np.min(y_curve) - 0.5) # Uncomment if f(x) can be < 0
ax.set_xlim([a, b])
ax.set_ylim([y_min, y_max])
ax.set_xlabel('$x$')
ax.set_ylabel('$f(x)$')
ax.set_title('Interactive Darboux Sums Visualization')
ax.grid(True)

# Placeholder for text displaying sums
text_display = ax.text(0.05, 0.95, '', transform=ax.transAxes, verticalalignment='top',
                       bbox=dict(boxstyle='round,pad=0.5', fc='wheat', alpha=0.8))

# Placeholder lists for rectangle patches (to remove them later)
upper_rect_patches = []
lower_rect_patches = []

# --- Update function for the slider ---
def update(val):
    global upper_rect_patches, lower_rect_patches
    n = int(slider_n.val) # Get number of partitions from slider

    # --- Remove previous rectangles ---
    for patch_list in [upper_rect_patches, lower_rect_patches]:
        while patch_list:
            patch = patch_list.pop()
            patch.remove()

    # --- Calculate partition points ---
    x_partitions = np.linspace(a, b, n + 1)
    delta_x = (b - a) / n
    upper_sum = 0
    lower_sum = 0

    # --- Calculate and draw rectangles for each subinterval ---
    for i in range(n):
        x_start = x_partitions[i]
        x_end = x_partitions[i+1]

        # Sample points within the subinterval to find inf/sup
        # More samples give better approximation of M_i, m_i
        sample_x = np.linspace(x_start, x_end, 100)
        sample_y = func(sample_x)

        M_i = np.max(sample_y) # Supremum (approx)
        m_i = np.min(sample_y) # Infimum (approx)

        # Add to sums
        upper_sum += M_i * delta_x
        lower_sum += m_i * delta_x

        # --- Create and add rectangle patches ---
        # Upper sum rectangle
        upper_rect = plt.Rectangle((x_start, 0), delta_x, M_i,
                                   edgecolor='darkred', facecolor='red', alpha=0.4)
        ax.add_patch(upper_rect)
        upper_rect_patches.append(upper_rect)

        # Lower sum rectangle
        lower_rect = plt.Rectangle((x_start, 0), delta_x, m_i,
                                   edgecolor='darkblue', facecolor='blue', alpha=0.6)
        ax.add_patch(lower_rect)
        lower_rect_patches.append(lower_rect)

    # Update the text display
    text_content = (f'$n = {n}$\n'
                    f'$U(f, P) = \\sum M_i \\Delta x_i \\approx {upper_sum:.4f}$\n'
                    f'$L(f, P) = \\sum m_i \\Delta x_i \\approx {lower_sum:.4f}$')
    text_display.set_text(text_content)

    # Add legend dynamically (only once needed elements exist)
    if 'upper_proxy' not in globals():
          global upper_proxy, lower_proxy
          upper_proxy = plt.Rectangle((0, 0), 1, 1, fc='red', alpha=0.4)
          lower_proxy = plt.Rectangle((0, 0), 1, 1, fc='blue', alpha=0.6)
          ax.legend([line, upper_proxy, lower_proxy],
                     ['$f(x)$', 'Upper Sum Rectangles ($U(f,P)$)', 'Lower Sum Rectangles ($L(f,P)$)'],
                     loc='upper right')


    # Redraw the plot
    fig.canvas.draw_idle()

# --- Slider setup ---
ax_slider = plt.axes([0.15, 0.1, 0.7, 0.03], facecolor='lightgoldenrodyellow') # Position [left, bottom, width, height]
slider_n = Slider(ax_slider,       # The axes object
                  'Partitions (n)', # Label
                  1,               # Min value
                  max_n,           # Max value
                  valinit=initial_n, # Initial value
                  valstep=1,       # Step size (must be integer)
                  color='skyblue')

# Attach the update function to the slider
slider_n.on_changed(update)

# --- Initial plot generation ---
update(initial_n)

# --- Show the plot ---
plt.show()