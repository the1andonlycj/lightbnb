SELECT city, COUNT(reservations.property_id) AS total_reservations
FROM properties
JOIN reservations ON properties.id = property_id
GROUP BY city
ORDER BY COUNT(reservations.property_id) DESC;