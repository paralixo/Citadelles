import request from "request-promise";
import { IRequestOptions } from "../../../../tests/unit/api/database/interfaces/RequestOptions.interface";
import { DATABASE_API_SERVER } from "@/api/database/constants/database.constants";
import { ALL_TYPES } from "@/api/database/constants/generation.constants";
import { CHARACTER, DISTRICT, TYPE } from "@/api/database/constants/collections.constants";
import { IResponseData } from "@/api/database/interfaces/ResponseData.interface";

function create (modelName: string, bodyParameters: any = {}) {
  const options: IRequestOptions = {
    uri: `${DATABASE_API_SERVER}/${modelName}`,
    json: true,
    body: bodyParameters
  };
  return request.post(options);
}

function clearAll (modelName: string) {
  const options: IRequestOptions = {
    uri: `${DATABASE_API_SERVER}/${modelName}`,
    json: true
  };
  return request.delete(options);
}

function get (modelName: string, bodyParameters: any = {}) {
  const options: IRequestOptions = {
    uri: `${DATABASE_API_SERVER}/${modelName}`,
    json: true,
    body: bodyParameters
  };
  return request.get(options);
}

async function setDistricts () {
  let typeId: any = {};
  typeId.religion = (await get(TYPE, { label: "Religion" })).data[0]._id;
  typeId.commerceEtArtisanat = (await get(TYPE, { label: "Commerce et artisanat" })).data[0]._id;
  typeId.noblesse = (await get(TYPE, { label: "Noblesse" })).data[0]._id;
  typeId.soldatesque = (await get(TYPE, { label: "Soldatesque" })).data[0]._id;
  typeId.prestige = (await get(TYPE, { label: "Prestige" })).data[0]._id;

  const districts = [
    { name: "Temple", image: "temple.jpg", description: null, price: 1, type: typeId.religion },
    { name: "Temple", image: "temple.jpg", description: null, price: 1, type: typeId.religion },
    { name: "Temple", image: "temple.jpg", description: null, price: 1, type: typeId.religion },
    { name: "Eglise", image: "eglise.jpg", description: null, price: 2, type: typeId.religion },
    { name: "Eglise", image: "eglise.jpg", description: null, price: 2, type: typeId.religion },
    { name: "Eglise", image: "eglise.jpg", description: null, price: 2, type: typeId.religion },
    { name: "Eglise", image: "eglise.jpg", description: null, price: 2, type: typeId.religion },
    { name: "Monastère", image: "monastere.jpg", description: null, price: 3, type: typeId.religion },
    { name: "Monastère", image: "monastere.jpg", description: null, price: 3, type: typeId.religion },
    { name: "Monastère", image: "monastere.jpg", description: null, price: 3, type: typeId.religion },
    { name: "Cathédrale", image: "cathedrale.jpg", description: null, price: 5, type: typeId.religion },
    { name: "Cathédrale", image: "cathedrale.jpg", description: null, price: 5, type: typeId.religion },

    { name: "Manoir", image: "manoir.jpg", description: null, price: 3, type: typeId.noblesse },
    { name: "Manoir", image: "manoir.jpg", description: null, price: 3, type: typeId.noblesse },
    { name: "Manoir", image: "manoir.jpg", description: null, price: 3, type: typeId.noblesse },
    { name: "Manoir", image: "manoir.jpg", description: null, price: 3, type: typeId.noblesse },
    { name: "Manoir", image: "manoir.jpg", description: null, price: 3, type: typeId.noblesse },
    { name: "Château", image: "chateau.jpg", description: null, price: 4, type: typeId.noblesse },
    { name: "Château", image: "chateau.jpg", description: null, price: 4, type: typeId.noblesse },
    { name: "Château", image: "chateau.jpg", description: null, price: 4, type: typeId.noblesse },
    { name: "Château", image: "chateau.jpg", description: null, price: 4, type: typeId.noblesse },
    { name: "Palais", image: "palais.jpg", description: null, price: 5, type: typeId.noblesse },
    { name: "Palais", image: "palais.jpg", description: null, price: 5, type: typeId.noblesse },

    { name: "Taverne", image: "taverne.jpg", description: null, price: 1, type: typeId.commerceEtArtisanat },
    { name: "Taverne", image: "taverne.jpg", description: null, price: 1, type: typeId.commerceEtArtisanat },
    { name: "Taverne", image: "taverne.jpg", description: null, price: 1, type: typeId.commerceEtArtisanat },
    { name: "Taverne", image: "taverne.jpg", description: null, price: 1, type: typeId.commerceEtArtisanat },
    { name: "Taverne", image: "taverne.jpg", description: null, price: 1, type: typeId.commerceEtArtisanat },
    { name: "Echoppe", image: "echoppe.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Echoppe", image: "echoppe.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Echoppe", image: "echoppe.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Marché", image: "marche.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Marché", image: "marche.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Marché", image: "marche.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Marché", image: "marche.jpg", description: null, price: 2, type: typeId.commerceEtArtisanat },
    { name: "Comptoir", image: "comptoir.jpg", description: null, price: 3, type: typeId.commerceEtArtisanat },
    { name: "Comptoir", image: "comptoir.jpg", description: null, price: 3, type: typeId.commerceEtArtisanat },
    { name: "Comptoir", image: "comptoir.jpg", description: null, price: 3, type: typeId.commerceEtArtisanat },
    { name: "Port", image: "port.jpg", description: null, price: 4, type: typeId.commerceEtArtisanat },
    { name: "Port", image: "port.jpg", description: null, price: 4, type: typeId.commerceEtArtisanat },
    { name: "Port", image: "port.jpg", description: null, price: 4, type: typeId.commerceEtArtisanat },
    { name: "Hôtel de ville", image: "hdv.jpg", description: null, price: 5, type: typeId.commerceEtArtisanat },
    { name: "Hôtel de ville", image: "hdv.jpg", description: null, price: 5, type: typeId.commerceEtArtisanat },

    { name: "Tour de guet", image: "tour.jpg", description: null, price: 1, type: typeId.soldatesque },
    { name: "Tour de guet", image: "tour.jpg", description: null, price: 1, type: typeId.soldatesque },
    { name: "Tour de guet", image: "tour.jpg", description: null, price: 1, type: typeId.soldatesque },
    { name: "Prison", image: "prison.jpg", description: null, price: 2, type: typeId.soldatesque },
    { name: "Prison", image: "prison.jpg", description: null, price: 2, type: typeId.soldatesque },
    { name: "Prison", image: "prison.jpg", description: null, price: 2, type: typeId.soldatesque },
    { name: "Caserne", image: "caserne.jpg", description: null, price: 3, type: typeId.soldatesque },
    { name: "Caserne", image: "caserne.jpg", description: null, price: 3, type: typeId.soldatesque },
    { name: "Forteresse", image: "forteresse.jpg", description: null, price: 5, type: typeId.soldatesque },
    { name: "Forteresse", image: "forteresse.jpg", description: null, price: 5, type: typeId.soldatesque },

    { name: "Cour des miracles", image: "cour_miracle.jpg", description: "Pour le décompte final des points, la cour des miracles est considérée comme un quartier de la couleur de votre choix. Vous ne pouvez pas utilisez cette capacité si vous avez construit la cour des miracles au dernier tour de jeu.", price: 2, type: typeId.prestige },
    { name: "Donjon", image: "donjon.jpg", description: "Le Donjon ne peut pas être détruit par le Condottière.", price: 3, type: typeId.prestige },
    { name: "Donjon", image: "donjon.jpg", description: "Le Donjon ne peut pas être détruit par le Condottière.", price: 3, type: typeId.prestige },
    { name: "Laboratoire", image: "laboratoire.jpg", description: "Une fois par tour, vous pouvez vous défausser d'une carte quartier de votre main et recevoir une pièce d'or en contrepartie", price: 5, type: typeId.prestige },
    { name: "Manufacture", image: "manufacture.jpg", description: "Une fois par tour, vous pouvez payer trois pièces d'or pour piocher trois cartes.", price: 5, type: typeId.prestige },
    { name: "Observatoire", image: "observatoire.jpg", description: "Si vous choisissez de piocher des cartes au début de votre tour, vous en piochez trois, en choisissez une et défaussez les deux autres.", price: 5, type: typeId.prestige },
    { name: "Cimetière", image: "cimetiere.jpg", description: "Lorsque le Condottière détruit un quartier, vous pouvez payer une pièce d'or pour le reprendre dans votre main. Vous ne pouvez pas faire cela si vous êtes vous-même Condottiere.", price: 5, type: typeId.prestige },
    { name: "Bibliothèque", image: "bibliotheque.jpg", description: "Si vous choisissez de piocher des cartes au début de votre tour, vous en piochez deux et les conservez toutes les deux.", price: 6, type: typeId.prestige },
    { name: "Ecole de magie", image: "ecole_magie.jpg", description: "Pour la perception des revenus, l'école de magie est considérée comme un quartier de la couleur de votre choix, elle vous rapporte donc si vous êtes, Roi, Evêque, Marchand ou Condottiere", price: 6, type: typeId.prestige },
    { name: "Université", image: "universite.jpg", description: "Cette réalisation de prestige (nul n'a jamais compris à quoi pouvait bien servir une université) coûte six pièces d'or à bâtir mais vaux huit points dans le décompte de fin de partie.", price: 6, type: typeId.prestige },
    { name: "Dracoport", image: "dracoport.jpg", description: "Cette réalisation de prestige (on n'a pas vu de dragon dans le Royaume depuis bientôt mille ans) coûte six pièces d'or à bâtir mais vaut huit points dans le décompte de fin de partie.", price: 6, type: typeId.prestige }
  ];

  districts.forEach(async (district: object) => {
    await create(DISTRICT, district);
  });
}

const characters = [
  { name: "Assassin", image: "assassin.jpg", description: "L'Assassin peut tuer le personnage de son choix. Celui-ci ne pourra pas jouer ce tour-ci", index: 1 },
  { name: "Voleur", image: "voleur.jpg", description: "Le Voleur peut voler le trésor du personnage de son choix. Il ne peut voler ni l'Assassin, ni un personnage assassiné. Le vol prendra effet au début du tour du personnage volé.", index: 2 },
  { name: "Magicien", image: "magicien.jpg", description: "Au choix: Le ¨Magicien peut échanger la totalité de ses cartes avec le joueur de son choix. Ou: le Magicien peut échanger des cartes de sa main contre le même nombre de cartes de la pioche.", index: 3 },
  { name: "Roi", image: "roi.jpg", description: "Le roi prend la carte Couronne et choisira en premier son personnage au prochain tour. Chaque quartier noble qu'il possède lui rapporte une pièce d'or.", index: 4 },
  { name: "Eveque", image: "eveque.jpg", description: "L'Évêque ne peut pas être attaqué par le Condottière. Chaque quartier religieux qu'il possède lui rapporte une pièce d'or", index: 5 },
  { name: "Marchand", image: "marchand.jpg", description: "Le Marchand reçoit une pièce d'or en plus au début de son tour. Chaque quartier marchand qu'il possède lui rapporte une pièce d'or.", index: 6 },
  { name: "Architecte", image: "architecte.jpg", description: "L'Architecte pioche deux cartes quartier en plus. Il peut bâtir jusqu'à trois quartiers.", index: 7 },
  { name: "Condotierre", image: "condotierre.jpg", description: "Le Condottiere peut détruire un quartier de son choix en payant à la banque le coût de construction du quartier moins un. Chaque quartier militaire qu'il possède lui rapporte une pièce d'or.", index: 8 }
];

async function setDatabase (characters: any[]) {
  await clearAll(TYPE);
  await clearAll(DISTRICT);
  await clearAll(CHARACTER);

  for (const type of ALL_TYPES) {
    await create(TYPE, type);
  }

  await setDistricts();

  for (const character of characters) {
    await create(CHARACTER, character);
  }
}

setDatabase(characters);
