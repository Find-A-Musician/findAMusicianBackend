

CREATE TABLE instruments (
    id uuid PRIMARY KEY,
    name VARCHAR  UNIQUE
);

CREATE TABLE musicians_instruments (
    musician uuid REFERENCES musicians (id),
    instrument uuid REFERENCES instruments (id)
);

INSERT INTO instruments VALUES (
    'cd836a31-1663-4a11-8a88-0a249aa70793',
    'batterie'
) , (
    'e345114e-7723-42eb-8ed1-f26cd2f9d084',
    'guitare'
);

INSERT INTO musicians_instruments VALUES (
    '8f6c1dd5-7444-46c9-b673-840731bfd041',
    'cd836a31-1663-4a11-8a88-0a249aa70793'
);