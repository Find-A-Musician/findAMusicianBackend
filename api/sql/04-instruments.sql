

CREATE TABLE instruments (
    id uuid PRIMARY KEY,
    name VARCHAR  UNIQUE
);

CREATE TABLE musicians_instruments (
    musician uuid  NOT NULL,
    instrument uuid NOT NULL
);

ALTER TABLE musicians_instruments ADD FOREIGN KEY (musician) REFERENCES musicians (id) ON DELETE CASCADE;
ALTER TABLE musicians_instruments ADD FOREIGN KEY (instrument) REFERENCES instruments (id) ON DELETE CASCADE;

INSERT INTO instruments VALUES (
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'drums'
) , (
    'e345114e-7723-42eb-8ed1-f26cd2f9d084',
    'guitar'
);

INSERT INTO musicians_instruments VALUES (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793'
), (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'e345114e-7723-42eb-8ed1-f26cd2f9d084'
);