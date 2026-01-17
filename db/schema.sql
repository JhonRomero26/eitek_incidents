
DROP TYPE IF EXISTS incident_status;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS assignees;

DROP INDEX IF EXISTS idx_incidents_status;
DROP INDEX IF EXISTS idx_incidents_assignee;

-- Estados base de una incidencia
CREATE TYPE incident_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');

CREATE TABLE
    assignees (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE assignees IS 'Responsables (personas o equipos) a los que se puede asignar una incidencia';

COMMENT ON COLUMN assignees.id IS 'Identificador único del responsable';

COMMENT ON COLUMN assignees.name IS 'Nombre del responsable o equipo';

COMMENT ON COLUMN assignees.role IS 'Rol o tipo del responsable (ej: soporte, operaciones)';

COMMENT ON COLUMN assignees.is_active IS 'Indica si el responsable está disponible para asignación';

COMMENT ON COLUMN assignees.created_at IS 'Fecha de creación del responsable';

CREATE TABLE
    incidents (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        status incident_status NOT NULL DEFAULT 'OPEN',
        assignee_id BIGINT NULL,
        date_assigned DATE NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW (),
        CONSTRAINT fk_incident_assignee FOREIGN KEY (assignee_id) REFERENCES assignees (id) ON DELETE SET NULL
    );

COMMENT ON TABLE incidents IS 'Incidencias operativas gestionadas por el sistema';

COMMENT ON COLUMN incidents.id IS 'Identificador único de la incidencia';

COMMENT ON COLUMN incidents.title IS 'Título corto de la incidencia';

COMMENT ON COLUMN incidents.description IS 'Descripción detallada del problema';

COMMENT ON COLUMN incidents.status IS 'Estado actual de la incidencia según el flujo definido';

COMMENT ON COLUMN incidents.assignee_id IS 'Responsable asignado a la incidencia (puede ser NULL)';

COMMENT ON COLUMN incidents.created_at IS 'Fecha de creación de la incidencia';

COMMENT ON COLUMN incidents.updated_at IS 'Fecha de última actualización de la incidencia';

-- Optimiza filtros por estado
CREATE INDEX idx_incidents_status ON incidents (status);

-- Optimiza búsquedas por responsable
CREATE INDEX idx_incidents_assignee ON incidents (assignee_id);
