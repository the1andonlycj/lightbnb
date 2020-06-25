--Test code for USERS table--
INSERT INTO users (name, email, password)
VALUES ('Ponchan', 'ponchan@tatebayashi.jp', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO users (name, email, password)
VALUES ('Gunmachan', 'gunmachan@gunma.jp', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

--Test code for PROPERTIES table--
INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES ('the other place', 'where stuff never happens', 'https:
//images.app.goo.gl/vcZrL4GrqYPu7ZMS8', 'https:
//images.app.goo.gl/vcZrL4GrqYPu7ZMS8', '15', '32', '12', '21', 'OH CANADA', 'StreetStreetStreet', 'TrontOH', 'SURE', 'WHY NOT')

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES ('the place', 'where stuff happens', 'https:
//images.app.goo.gl/vcZrL4GrqYPu7ZMS8', 'https:
//images.app.goo.gl/vcZrL4GrqYPu7ZMS8', '5', '2', '1', '2', 'OH CANADA', 'Streetstreet', 'Tront', 'SURE', 'WHY NOT')

--Test code for RESERVATIONS--
INSERT INTO reservations (start_date, end_date, guest_id, property_id)
VALUES ('2019-02-02', '2019-02-05', 1, 1),
('2019-03-03', '2019-06-06', 2, 2);

--Test code for PROPERTY_REVIEWS--
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 2, 1, 4, 'message'),
(1, 2, 2, 2, 'message'),
(2, 1, 2, 2, 'message'),
(2, 2, 1, 4, 'message');