from graphviz import Digraph

# Create Use Case Diagram
use_case = Digraph('UseCaseDiagram', filename='/mnt/data/use_case_diagram', format='png')
use_case.attr(rankdir='LR', size='8,5')

# Add actors
use_case.node('User', 'Utilisateur', shape='actor')
use_case.node('System', 'Système', shape='ellipse')

# Add use cases
use_cases = [
    "Recherche de livres",
    "Lecture en ligne",
    "Téléchargement de livres",
    "Ajout de commentaires",
    "Consultation des avis",
    "Participation au chat"
]
for uc in use_cases:
    use_case.node(uc, uc, shape='ellipse')

# Connect actors to use cases
for uc in use_cases:
    use_case.edge('User', uc)
    use_case.edge(uc, 'System')

use_case.render()

# Create Class Diagram
class_diagram = Digraph('ClassDiagram', filename='/images/class_diagram', format='png')
class_diagram.attr(rankdir='TB', size='8,5')

# Add classes
class_diagram.node('User', '''\
Utilisateur
-----------
+ id
+ nom
+ email
+ statut
-----------
+ créerCompte()
+ seConnecter()
''', shape='record')

class_diagram.node('Book', '''\
Livre
-----------
+ id
+ titre
+ auteur
+ résumé
+ catégorie
+ fichiers
-----------
+ rechercher()
+ lire()
''', shape='record')

class_diagram.node('Comment', '''\
Commentaire
-----------
+ id
+ contenu
+ date
+ utilisateur_id
+ livre_id
-----------
+ ajouterCommentaire()
+ consulterCommentaire()
''', shape='record')

# Add relationships
class_diagram.edge('User', 'Comment', label='1...*')
class_diagram.edge('Book', 'Comment', label='1...*')

class_diagram.render()

("/mnt/data/use_case_diagram.png", "/mnt/data/class_diagram.png")
