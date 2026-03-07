-- Creating Tables

-- Strong Tables

create table discipline (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(45) not null unique 
);

create table role (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(20) not null unique
);

create table department (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(50) not null unique
);

create table scenario (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(45) not null unique,
	location VARCHAR(70) not null
);

create table notification (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(50) not null,
	description VARCHAR(200) not null,
	type VARCHAR(20) not null,
	urgent BOOLEAN not null,
	created_at TIMESTAMP default now()
);

-- Weak tables

create table "user" (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(30) not null,
	email VARCHAR(50) not null unique,
	password_hash VARCHAR(200) not null,
	is_active BOOLEAN not null,
	created_at TIMESTAMP default now(),
	department_id UUID references department(id),
	role_id UUID references role(id)
);

create table goal (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(45) not null,
	amount INT not null,
	year INT not null default extract(year from CURRENT_DATE),
	month VARCHAR(20) not null default to_char(CURRENT_DATE, 'Month'),
	discipline_id UUID references discipline(id),
	department_id UUID references department(id)
);

create table space (
	id UUID primary key default gen_random_uuid(),
	name VARCHAR(45) not null,
	description VARCHAR(45) not null,
	status VARCHAR(15),
	created_at TIMESTAMP default now(),
	scenario_id UUID references scenario(id)
);

create table event (
	id UUID primary key default gen_random_uuid(),
	title VARCHAR(30) not null,
	description VARCHAR(80),
	start_date TIMESTAMP not null default now(),
	finish_date TIMESTAMP not null,
	is_active BOOLEAN not null,
	created_at TIMESTAMP default now(),
	discipline_id UUID references discipline(id),
	scenario_id UUID references scenario(id),
	space_id UUID references space(id)
);

-- Relational tables

create table notification_user (
	id UUID primary key default gen_random_uuid(),
	notification_id UUID references notification(id),
	event_id UUID references event(id)
);

create table event_user (
	id UUID primary key default gen_random_uuid(),
	user_id UUID references "user"(id),
	event_id UUID references event(id)
);