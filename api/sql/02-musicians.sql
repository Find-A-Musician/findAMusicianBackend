CREATE TYPE promotions AS ENUM(
    'L1',
    'L2',
    'L3',
    'M1',
    'M2'
);

CREATE TYPE locations AS ENUM(
    'Douai',
    'Lille'
);


CREATE TABLE musicians (
    id uuid PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    given_name VARCHAR DEFAULT NULL,
    family_name VARCHAR DEFAULT NULL,
    phone VARCHAR(50) UNIQUE DEFAULT NULL,
    facebook_url text UNIQUE DEFAULT NULL,
    twitter_url text UNIQUE DEFAULT NULL,
    instagram_url text UNIQUE DEFAULT NULL,
    promotion promotions DEFAULT NULL,
    password text DEFAULT NULL,
    location locations DEFAULT NULL
);


INSERT INTO musicians VALUES (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'romain.guar01@gmail.com',
    'Romain',
    'Guarinoni',
    '0766072513',
    NULL,
    NULL,
    NULL,
    'M1',
    --mdp : romain123
    '$2b$10$oSkbT5bDabLIuJ5ikcdKT.11kquR8q4MU7sbgo1tFWU67AgnOcppu',
    'Douai'
) , (
    '8c9a685a-2be9-4cf0-a03c-0b316fc4b515',
    'guillaume.faure@gmail.com',
    'Guillaume',
    'Faure',
    NULL,
    NULL,
    NULL,
    NULL,
    'M1',
    --mdp : guillaume123
    '$2b$10$BYtlJ2MV8d59/wLABQZO6.n.CSb9bkegfUwmsARqISHePVK5zxbh6',
    'Douai'
) , (
    '74f3d613-39e7-4891-8491-8114988f490c',
    'dorian.viala@gmail.com',
    'Dorian',
    'Viala',
    NULL,
    NULL,
    NULL,
    NULL,
    'M1',
    --mdp : dorian123
    '$2b$10$ebn7aGHs7nvFmyg0PIeaU.z0NegP/ikxX9rt7na4nZuJh9NA60BIq',
    'Douai'
);