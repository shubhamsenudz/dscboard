CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    created_at VARCHAR(40)
);
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(40),
    created_at VARCHAR(40)
);
CREATE UNIQUE INDEX ux_users_email ON users(email);

CREATE TABLE holders (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    name VARCHAR(255),
    pan VARCHAR(255),
    phone VARCHAR(255),
    created_at VARCHAR(40)
);

CREATE TABLE certificates (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    holder_id BIGINT,
    serial_no VARCHAR(255),
    token_serial VARCHAR(255),
    dsc_class VARCHAR(255),
    expires_on VARCHAR(255),
    portal VARCHAR(255),
    created_at VARCHAR(40)
);
