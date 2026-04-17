CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(75) NOT NULL,
    location VARCHAR(75),
    description TEXT,
    shooting_year INTEGER NOT NULL
);

CREATE TABLE prices (
	price_id SERIAL PRIMARY KEY,
	category VARCHAR(50) NOT NULL,
	price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holder_first_name VARCHAR(75) NOT NULL,
    holder_last_name VARCHAR(75) NOT NULL,
    holder_mail VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months'),
    has_booklet BOOL NOT NULL DEFAULT False,
    fk_price_id INT NOT NULL REFERENCES prices(price_id),
    fk_order_id INT NOT NULL REFERENCES orders(order_id)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
	article_id SERIAL PRIMARY KEY,
	title VARCHAR(150) NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	page VARCHAR(255) NOT NULL,
	date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	author VARCHAR(100),
	thumbnail VARCHAR(255) NOT NULL
);

INSERT INTO photos (url, title, location, description, shooting_year) VALUES
('Autoportrait_au_Rolleiflex_1947.jpg', 'Autoportrait au Rolleiflex', 'Atelier Doisneau, Montrouge', 'L''artista si riflette, catturando l''essenza del fotografo che osserva il mondo attraverso la sua lente binoculare.', 1947),
('Créatures_de_Rêve_1952.jpeg', 'Créatures de Rêve', 'Les Halles, Parigi', 'Un''immagine onirica catturata tra le strade di Parigi, dove il reale si fonde con l''immaginazione.', 1952),
('doisneau-train-juvisy.jpg', 'doisneau-train-juvisy', 'Gare de Juvisy-sur-Orge', 'La geometria dei binari e la vita dei pendolari nella stazione di Juvisy, un classico del paesaggio industriale.', 1943),
('Henri_Heraut_-_le_collectionneur_de_poupées_1950.jpg', 'Henri Heraut - le collectionneur de poupées', 'Rue de Seine, Parigi', 'Un ritratto intimo del collezionista Henri Heraut circondato dalle sue inquietanti e affascinanti bambole.', 1950),
('Hommages_Respectueux_1954.jpg', 'Hommages Respectueux', 'Avenue de l''Opéra, Parigi', 'Uno sguardo ironico e garbato sulle interazioni sociali e il rispetto formale nella Parigi del dopoguerra.', 1954),
('L_équipe_de_football_de_la_rue_des_Panoyaux_1936.jpg', 'L_équipe de football de la rue des Panoyaux', 'Ménilmontant, Parigi', 'L''infanzia di strada: una squadra di ragazzi posa con orgoglio nel quartiere di Ménilmontant.', 1936),
('La_cabine_de_Lanvin_(Paris_1958).png', 'La cabine de Lanvin', 'Maison Lanvin, Faubourg Saint-Honoré', 'Dietro le quinte dell''alta moda parigina, tra l''eleganza dei preparativi e il rigore dello stile.', 1958),
('La_Dame_aux_chats_1982.jpg', 'La Dame aux chats', 'Le Marais, Parigi', 'Un incontro magico e quotidiano con una donna e i suoi compagni felini tra i vicoli del Marais.', 1982),
('La_Dernière_Valse_du_14_juillet_(L_ultimo_valzer_del_14_luglio)_1949.jpeg', 'La Dernière Valse du 14 luglio', 'Place de la Bastille, Parigi', 'La nostalgia e la gioia popolare nell''ultima danza durante la festa nazionale francese.', 1949),
('La_femme_aux_bau_the_Provence.jpg', 'La femme aux bau the Provence', 'Les Baux-de-Provence', 'Luce e contrasti provenzali che incorniciano una figura femminile in un momento di quiete.', 1958),
('La_Maison_des_Locataires_1962.jpg', 'La Maison des Locataires', 'Rue de la Cerisaie, Parigi', 'Uno spaccato di vita condominiale, dove ogni finestra racconta una storia diversa della classe operaia.', 1962),
('La_plage_des_Sables_d_Olonne_1959.jpg', 'La plage des Sables d_Olonne', 'Vandea, Costa Atlantica', 'Le prime vacanze popolari, tra la sabbia e il desiderio di libertà dei bagnanti sulla costa atlantica.', 1959),
('Le_Baiser_de_l_Hôtel_de_Ville_1950.jpg', 'Le Baiser de l_Hôtel de Ville', 'Place de l''Hôtel de Ville, Parigi', 'L''icona suprema dell''amore parigino, uno scatto che ha definito il romanticismo del XX secolo.', 1950),
('Le_Chien_à_roulettes_(Il_cane_a_rotelle)_1977.jpg', 'Le Chien à roulettes', 'Boulevard Diderot, Parigi', 'L''ironia di Doisneau catturata in un giocattolo dimenticato che sembra prendere vita sul marciapiede.', 1977),
('Le_jardin_de_l_homme_à_la_trompette_1949.jpg', 'Le jardin de l_homme à la trompetta', 'Gentilly, Val-de-Marne', 'Note musicali che sembrano fiorire in un piccolo giardino segreto di periferia.', 1949),
('Le_Jardin_de_la_Concierge_Les_Concierges_Rue_du_Dragon_1946.jpg', 'Le Jardin de la Concierge Les Concierges Rue du Dragon', 'Saint-Germain-des-Prés, Parigi', 'La vita quotidiana e il micro-mondo delle portinaie parigine in Rue du Dragon.', 1946),
('Le_Peintre_de_la_Place_du_Vert-Galant_1950.jpg', 'Le Peintre de la Place du Vert-Galant', 'Île de la Cité, Parigi', 'Un artista catturato mentre tenta di imprigionare la bellezza della Senna sulla tela.', 1950),
('Le_ponton_baie_de_Toulon_1949.jpg', 'Le ponton baie de Toulon', 'La Seyne-sur-Mer, Tolone', 'Orizzonti marini e geometrie di legno nella baia di Tolone, lontano dal caos cittadino.', 1949),
('Le_regarde_oblique_1948.jpg', 'Le regarde oblique', 'Boutique Romi, Rue de Seine', 'Una lezione di psicologia sociale in un solo scatto: lo sguardo catturato da un dipinto in una vetrina.', 1948),
('Le_repos_des_ouvriers_sur_les_marches_de_la_Bourse_1950.jpg', 'Le repos des ouvriers sur les marches de la Bourse', 'Palais Brongniart, Parigi', 'Il contrasto tra la solennità del tempio della finanza e la stanchezza dignitosa del lavoro manuale.', 1950),
('Les_ballatte_due_Pierrette_d_Orient_1953.jpg', 'Les ballatte due Pierrette d_Orient', 'Cabaret L''Escalier, Parigi', 'L''eleganza e la stravaganza del mondo dello spettacolo e del cabaret parigino.', 1953),
('Les_Chiens_de_la_Chapelle_1953.jpg', 'Les Chiens de la Chapelle', 'Porte de la Chapelle, Parigi', 'La vita animale nei quartieri popolari della Chapelle, tra binari e case popolari.', 1953),
('Les_enfants_de_la_place_Hébert_1957.webp', 'Les children de la place Hébert', '18° Arrondissement, Parigi', 'Giochi infantili e libertà nel dopoguerra, tra le macerie e la speranza di Place Hébert.', 1957),
('Les_enfants_de_la_rue_Vilin_à_Belleville_1969.png', 'Les children de la rue Vilin à Belleville', 'Belleville, Parigi', 'Le lunghe scale di Belleville diventano il palcoscenico per le avventure dei bambini del quartiere.', 1969),
('Les_Hélicoptères_1972.jpg', 'Les Hélicoptères', 'Issy-les-Moulineaux', 'L''avvento della modernità tecnologica che sovrasta la vita tranquilla della periferia.', 1972),
('Les_Mains_de_l_industrie_1951.jpg', 'Les Mains de l_industrie', 'Officine Renault, Billancourt', 'Un omaggio poetico al lavoro manuale nelle officine Renault di Billancourt.', 1951),
('Les_pains_de_Picasso_1952.jpg', 'Les pains de Picasso', 'Vallauris, Costa Azzurra', 'Il genio di Picasso si presta al gioco visivo di Doisneau in questo celebre e ironico ritratto.', 1952),
('Leschiotsen_laisse_Paris1934.jpg', 'Leschiotsen_laisse_Paris', 'Pont des Arts, Parigi', 'Piccoli momenti di tenerezza e vita cittadina lungo i boulevard di Parigi.', 1934),
('Madmoiselle_Anita_1951.jpg', 'Madmoiselle Anita', 'Le Petit Châtelet, Parigi', 'La solitudine e il fascino di Anita in un bar di Pigalle, un''icona della notte parigina.', 1951),
('Mariage_de_la_rue_de_l_Arbalète_1951.jpg', 'Mariage de la rue de l_Arbalète', 'Quartiere Latino, Parigi', 'Un corteo nuziale attraversa le strade del 5° arrondissement, un momento di gioia collettiva.', 1951),
('Square_du_Vert-Galant_1950.jpg', 'Square du Vert-Galant', 'Pont Neuf, Parigi', 'La punta dell''Île de la Cité, rifugio di amanti e sognatori sulle rive della Senna.', 1950),
('Theatre_despuces1950.jpg', 'Theatre_despuces', 'Saint-Ouen, Mercato delle Pulci', 'Il fascino decadente e vivace del mercato delle pulci di Saint-Ouen.', 1950),
('Traffic_Policeman,_Place_de_la_Madeleine_1951.jpg', 'Traffic Policeman, Place de la Madeleine', 'Place de la Madeleine, Parigi', 'L''ordine coreografico di un vigile urbano nel cuore pulsante del lusso parigino.', 1951),
('Une_femme_passe_1947.jpg', 'Une femme passe', 'Rue de Rivoli, Parigi', 'La bellezza fugace di un istante: una donna attraversa la strada e cattura l''eternità.', 1947);