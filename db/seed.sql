-- Seeds for assignees
INSERT INTO assignees (id, name, role, is_active, created_at, updated_at) VALUES
(1, 'Juan Pérez', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'María García', 'TECHNICAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Carlos López', 'OPERATOR', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Ana Martínez', 'SUPPORT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Seeds for incidents  
INSERT INTO incidents (id, title, status, description, assignee_id, date_assigned, created_at, updated_at) VALUES
(1, 'Error de conexión BD', 'OPEN', 'La base de datos no responde a peticiones externas.', 1, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Fallo en Login Social', 'ASSIGNED', 'El botón de Google Login devuelve un 500.', 2, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Actualizar documentación', 'ASSIGNED', 'La guía de instalación está desactualizada.', 3, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Optimizar Dashboard', 'RESOLVED', 'La carga del dashboard tarda más de 2 segundos.', 4, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Actualizar las secuencias para evitar conflictos
SELECT setval('assignees_id_seq', (SELECT MAX(id) FROM assignees));
SELECT setval('incidents_id_seq', (SELECT MAX(id) FROM incidents));


-- -- Seeds for roles
-- INSERT INTO "roles" (id, name, code, created_at, updated_at) VALUES
-- (1, 'Administrador', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 'Técnico', 'technical', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 'Operaciones', 'operator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 'Soporte', 'support', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- INSERT INTO "users" (id, first_name, last_name, email, password, created_at, updated_at) VALUES
-- (1, 'Juan', 'Pérez', 'juan.perez@eitek.com', '$2a$12$0iwX9S0WSAp7XaUEz.AEsucvrNV7CoO6OMCZ48J4NScfVl.v/Xa4m', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 'María', 'García', 'maria.garcia@eitek.com', '$2a$12$uMqwABw3sV37aPTg4g0pHed9V5YE5MCdaWWWqixX8d1EPDxcjiEW2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 'Carlos', 'López', 'carlos.lopez@eitek.com', '$2a$12$8e7fZxPgW/iym9QdH7nE5.9qgA.GMlEjCfJNyHDGtsSZqDDg2rMNa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 'Ana', 'Martínez', 'ana.martinez@eitek.com', '$2a$12$Y09XR.FrC2qQa7qruR0MV.IDGbxE6P/Ir7CaVW8a7r1pN1yGiAuNG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- Seeds for assignee (links users to roles)
-- INSERT INTO "assignee" (id, user_id, role_id, is_active, created_at, updated_at) VALUES
-- (1, 1, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 2, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 3, 3, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 4, 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- Seeds for tags
-- INSERT INTO "tag" (id, name, created_at, updated_at) VALUES
-- (1, 'Crítico', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 'Bajo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 'Duda', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 'Mejora', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- Seeds for incident
-- INSERT INTO "incident" (id, name, status, description, assignee_id, tag_ids, date_assigned, created_at, updated_at) VALUES
-- (1, 'Error de conexión BD', 'OPEN', 'La base de datos no responde a peticiones externas.', 1, 1, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (2, 'Fallo en Login Social', 'ASSIGNED', 'El botón de Google Login devuelve un 500.', 2, 1, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (3, 'Actualizar documentación', 'ASSIGNED', 'La guía de instalación está desactualizada.', 3, 3, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (4, 'Optimizar Dashboard', 'RESOLVED', 'La carga del dashboard tarda más de 2 segundos.', 4, 4, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
