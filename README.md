# Citadelles
Il s'agit d'un jeu sur navigateur repris du jeu de société du même nom "Citadelle".

## Motivation
Ce jeu est notre projet de bachelor 3. C'est un jeu de cartes qui demande de la réflexion mais qui reste amusant et sans prise de tête entre amis. Il convient parfaitement aux petits comme aux grands. Il est aussi possible de faire des parties qui sont rapide , pratique quand on a pas beaucoup de temps.

## Statut du projet
Ca peut être assez interessant : voir sonarqube, travis, appveyor

## Style du code
Utilisation d'ESLint avec standardJS + linting de typescript
```
yarn lint
```

## Screenshots
A terme

## Technologies utilisées (en vrac et non exhaustif)
- Vue CLI
- Electron
- Jest
- TypeScript
- VueJS
- MongoDB
- ORM Mongoose

## Installation
```
git clone <http/ssh>
cd citadelles
yarn install / npm install
yarn electron:serve / npm electron:serve
```

## Deploiement
``` 
yarn electron:build
```
Puis envoyer l'installeur `./dist_electron/citadelles.exe`

## Tests
Après avoir lancé l'application (pour que les apis tournent)
```
yarn test:unit
```

## Le jeu
Voici les règles officielles du jeu : http://jeuxstrategie.free.fr/Citadelles_complet.php

Dans Citadelles, le but est de bâtir une cité prestigieuse avant que vos adversaires ne parviennent à construire la leur. Pour développer votre ville et de nouveaux quartiers, il vous faudra bien sûr de l’or, mais aussi le soutien des notables locaux, roi, échevin, cardinal, patricien ou archiviste, et parfois aussi de la lie de la cité, voleur, espion, assassin ou sorcière.

Citadelles est un jeu de bluff, d’intrigues et de stratégie. Les joueurs amassent de l’or qu’ils dépensent ensuite pour bâtir les quartiers qui composent leur cité médiévale. À la fin de la partie, le joueur qui a constitué la plus belle, la plus grande, la plus prestigieuse cité est vainqueur.
Citadelles est un jeu de stratégie qui se déroule dans un monde médiéval fantastique. Vous devez construire la plus grande et la plus belle ville du monde, avec différentes cartes qui représentent les quartiers: Université, Château, Cathédrale etc.

Pour réaliser cela, vous serez tour à tour l'un des plus puissants personnages de la ville, le Roi, l'Evèques, le Marchand etc. Mais il n'est pas facile de construire une Citadelles prospère et unique: cela nécessite richesses, ambition et filouterie.

Les parties sont toutes différentes et il vous faudra user de tactique et de ruse pour parvenir au succès en évitant le coups tordus des autres joueurs (vol, assassinat).

Chaque joueur développe une cité pour la rendre la plus riche et la plus prestigieuse. Vous construisez des quartiers à l'aide de cartes que vous exposez devant vous.
A chaque tour, les joueurs doivent incarner un personnage doté d'un pouvoir particulier : construire plus vite, détruire un quartier, assassiner, voler, remplir son trésor, protéger sa cité, piocher plus de cartes .

Pourrez-vous deviner quels sont les personnages choisis par les autres joueurs ? Serez-vous victime de l'assassin ou du voleur ? A moins que vous ne soyez vous-même l'assassin ou le voleur!

Rebondissements, coups tordus et ruses sont les points forts de Citadelles. Les règles sont simples et accessibles et on se plonge volontiers dans l'ambiance médiévale.

## Routes
#API Database "localhost:3000" : 

```/character``` : Permet d'obtenir la liste des personnages.

```/deck``` : Permet d'avoir la liste des cartes des deck sous forme d'id.

```/district``` : Permet d'avoir la liste des cartes de quartier.

```/player``` : Permet d'avoir la liste des players ainsi que de leurs informations.

```/type``` : Permet d'avoir la liste des differents types de quartier.

#API Du jeu "localhost:3001" :

```/initialize ``` : Permet d'initialiser la partie.

```/generateCharacters``` : Permet de générer le deck de personnages.

```/player/:name/character/:position``` : Assigne une carte de personnage dans le deck de personnages à un joueur.

```/player/:name/choice/:choice```: Permet de choisir entre : prendre de l'argent (3 pièces d'or) ou de piocher deux cartes et les mettre dans la main 'temporaire' du joueur au debut de son tour de jeu.

```/player/:name/discard/:choice```: Permet de choisir une carte à ajouter de la main temporaire à la main 'définitive' du joueur.

```/player/:name/buy/:choice```: Achète un quartier à acheter depuis la main.

```/player/:name/startTurn```: Permet de cibler un joueur avec le voleur ou l'assassin.

```/player/:name/magician/:choice``` : Active un des pouvoir du magicien.

```/player/:name/condottieri``` : Active le pouvoir de la condottière

```/player/:name/victory``` : Met le joueur dans le mode 'isFinished'./

```/player/:name/countPoints``` : Permet de donner le score du joueur à la fin de la partie.

```/player/:name/computer/choiceBeginning``` : L'ordinateur de faire son choix de début de tour en fonction des cartes et de l'argent qu'il possède.

```/player/:name/computer/buyDistrict``` : L'ordinateur de choisir 1 quartier à acheter, si il en a la possibilité, en fonction des cartes et de l'argent qu'il possède.

```/player/:name/laboratory/:choice``` : Active le pouvoir du laboratoire si il est posé sur le terrain du joueur.

```/player/:name/manufacture``` : Active le pouvoir de la manufacture si elle est posé sur le terrain du joueur.


## Contribution
Developpeurs : Clément MEHAYE et Florian LAFUENTE

sources, repos, inspirations, blogs, personnes qui ont participé
directement ou indirectement au projet

## Contacts
Clément MEHAYE : clement.mehaye@ynov.com
Florian LAFUENTE : florian.lafuente@ynov.com

## License 
jsp
