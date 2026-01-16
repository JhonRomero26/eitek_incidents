-- DROP objects in reverse order of creation to avoid dependency issues
DROP TRIGGER IF EXISTS update_tag_updated_at ON tag;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
DROP TRIGGER IF EXISTS update_assignee_updated_at ON assignee;
DROP TRIGGER IF EXISTS update_incident_updated_at ON incident;

DROP TABLE IF EXISTS incident;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS assignee;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- Estados base de una incidencia
CREATE TYPE incident_status AS ENUM ('OPEN', 'ASSIGNED', 'RESOLVED');

-- Esquema de la base de datos para el sistema de gestión de incidencias
CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NULL,
    email VARCHAR(60) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
    ADD CONSTRAINT unique_user_email UNIQUE (email);

CREATE TABLE roles(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE roles
    ADD CONSTRAINT unique_role_name UNIQUE (name);
ALTER TABLE roles
    ADD CONSTRAINT unique_role_code UNIQUE (code);

CREATE TABLE assignee(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NULL,
    is_active BOOL NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE assignee
    ADD CONSTRAINT unique_assignee_user_role UNIQUE (user_id, role_id);

CREATE TABLE tag(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE tag
    ADD CONSTRAINT unique_tag_name UNIQUE (name);

CREATE TABLE incident(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status incident_status NOT NULL DEFAULT 'OPEN',
    description TEXT NOT NULL,
    assignee_id BIGINT NULL,
    tag_ids BIGINT NULL,
    date_assigned DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Constraints para referencias foráneas
ALTER TABLE assignee
    ADD CONSTRAINT fk_assignee_user FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE;
ALTER TABLE assignee
    ADD CONSTRAINT fk_assignee_role FOREIGN KEY (role_id) REFERENCES roles (id)
    ON DELETE SET NULL;
ALTER TABLE incident
    ADD CONSTRAINT fk_incident_assignee FOREIGN KEY (assignee_id) REFERENCES assignee (id)
    ON DELETE SET NULL;
ALTER TABLE incident
    ADD CONSTRAINT fk_incident_tag FOREIGN KEY (tag_ids) REFERENCES tag (id)
    ON DELETE SET NULL;


-- Indices para optimizar búsquedas
CREATE INDEX idx_incidents_status ON incident (status);
CREATE INDEX idx_incidents_assignee ON incident (assignee_id);

-- Comentarios base de la prueba técnica
COMMENT ON TABLE assignee IS 'Responsables (personas o equipos) a los que se puede asignar una incidencia';
COMMENT ON COLUMN assignee.id IS 'Identificador único del responsable';
COMMENT ON COLUMN assignee.is_active IS 'Indica si el responsable está disponible para asignación';

COMMENT ON TABLE incident IS 'Incidencias operativas gestionadas por el sistema';
COMMENT ON COLUMN incident.id IS 'Identificador único de la incidencia';
COMMENT ON COLUMN incident.name IS 'Título corto de la incidencia';
COMMENT ON COLUMN incident.description IS 'Descripción detallada del problema';
COMMENT ON COLUMN incident.status IS 'Estado actual de la incidencia según el flujo definido';
COMMENT ON COLUMN incident.assignee_id IS 'Responsable asignado a la incidencia (puede ser NULL)';

COMMENT ON TABLE roles IS 'Roles que pueden tener los usuarios del sistema';
COMMENT ON COLUMN roles.id IS 'Identificador único del rol';
COMMENT ON COLUMN roles.name IS 'Nombre descriptivo del rol';
COMMENT ON COLUMN roles.code IS 'Código único del rol para referencias internas';

COMMENT ON TABLE users IS 'Usuarios del sistema que pueden reportar y gestionar incidencias';
COMMENT ON COLUMN users.id IS 'Identificador único del usuario';
COMMENT ON COLUMN users.first_name IS 'Nombre del usuario';
COMMENT ON COLUMN users.last_name IS 'Apellido del usuario';
COMMENT ON COLUMN users.email IS 'Correo electrónico del usuario (único)';

COMMENT ON TABLE tag IS 'Etiquetas que se pueden asignar a las incidencias para su categorización';
COMMENT ON COLUMN tag.id IS 'Identificador único de la etiqueta';
COMMENT ON COLUMN tag.name IS 'Nombre descriptivo de la etiqueta';


-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
CREATE TRIGGER update_incident_updated_at BEFORE UPDATE ON incident FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_assignee_updated_at BEFORE UPDATE ON assignee FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tag_updated_at BEFORE UPDATE ON tag FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
