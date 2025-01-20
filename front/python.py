from PIL import Image
import numpy as np

# Charger l'image
image_path = "C:\\Users\\omaim\\Downloads\\myport\\meyawo\\public_html\\assets\\imgs\\header.jpg"  # Remplacez par le chemin de votre image
image = Image.open(image_path).convert("RGBA")

# Convertir l'image en tableau numpy
image_data = np.array(image)

target_color = np.array([38, 92, 167, 255])  # Couleur bleu en RGBA
new_color = np.array([255, 165, 0, 255]) 
# Remplacer la couleur cible par la nouvelle couleur
tolerance = 70  # Augmenter la tolérance pour détecter les couleurs similaires

# Comparer les canaux RGB et l'alpha (facultatif, si vous voulez être précis)
mask = np.all(np.abs(image_data[:, :, :3] - target_color[:3]) <= tolerance, axis=-1) & (image_data[:, :, 3] == 255)

# Remplacer la couleur uniquement dans les pixels correspondants
image_data[mask] = new_color

# Créer une nouvelle image à partir des données modifiées
new_image = Image.fromarray(image_data, "RGBA")

# Enregistrer l'image modifiée
output_path = "l.png"
new_image.save(output_path)
print(f"L'image modifiée a été enregistrée sous {output_path}")
