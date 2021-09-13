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
    NULL,
    'Douai'
);