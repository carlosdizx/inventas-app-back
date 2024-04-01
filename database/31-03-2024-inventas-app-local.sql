--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5 (Debian 15.5-1.pgdg120+1)
-- Dumped by pg_dump version 15.5

-- Started on 2024-04-01 02:44:06 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 25029)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 879 (class 1247 OID 25203)
-- Name: categories_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categories_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.categories_status_enum OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 25092)
-- Name: clients_document_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clients_document_type_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.clients_document_type_enum OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 25102)
-- Name: clients_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.clients_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.clients_status_enum OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 25232)
-- Name: enterprises_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enterprises_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.enterprises_status_enum OWNER TO postgres;

--
-- TOC entry 930 (class 1247 OID 58218)
-- Name: payments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payments_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.payments_status_enum OWNER TO postgres;

--
-- TOC entry 876 (class 1247 OID 25167)
-- Name: products_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.products_status_enum OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 25125)
-- Name: sales_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sales_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.sales_status_enum OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 25134)
-- Name: sales_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sales_type_enum AS ENUM (
    '0',
    '1'
);


ALTER TYPE public.sales_type_enum OWNER TO postgres;

--
-- TOC entry 861 (class 1247 OID 25059)
-- Name: user_details_document_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_details_document_type_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.user_details_document_type_enum OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 25262)
-- Name: users_roles_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_roles_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.users_roles_enum OWNER TO postgres;

--
-- TOC entry 885 (class 1247 OID 25253)
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_status_enum AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.users_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 33358)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    status public.categories_status_enum DEFAULT '2'::public.categories_status_enum NOT NULL,
    enterprise_id uuid
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 33291)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_number character varying NOT NULL,
    document_type public.clients_document_type_enum NOT NULL,
    status public.clients_status_enum DEFAULT '2'::public.clients_status_enum NOT NULL,
    names character varying NOT NULL,
    surnames character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    enterprise_id uuid
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 33369)
-- Name: enterprises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enterprises (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    address character varying,
    status public.enterprises_status_enum DEFAULT '0'::public.enterprises_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.enterprises OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 33313)
-- Name: inventories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    location character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    enterprise_id uuid
);


ALTER TABLE public.inventories OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 33398)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying NOT NULL,
    "timestamp" timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 33397)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 227
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 217 (class 1259 OID 33283)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    client_id uuid,
    enterprise_id uuid,
    status public.payments_status_enum DEFAULT '2'::public.payments_status_enum NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33325)
-- Name: product_inventories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_inventories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    product_id uuid,
    inventory_id uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_inventories OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 33331)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    barcode character varying,
    sale_price numeric NOT NULL,
    cost_price numeric NOT NULL,
    status public.products_status_enum DEFAULT '2'::public.products_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    enterprise_id uuid,
    category_id uuid,
    subcategory_id uuid,
    "requiresInventory" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33304)
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    status public.sales_status_enum DEFAULT '2'::public.sales_status_enum NOT NULL,
    type public.sales_type_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    enterprise_id uuid,
    inventory_id uuid NOT NULL,
    client_id uuid
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 33277)
-- Name: sales_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    product_id uuid,
    sale_id uuid
);


ALTER TABLE public.sales_details OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33348)
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "categoryId" uuid
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 33267)
-- Name: user_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    document_number character varying NOT NULL,
    document_type public.user_details_document_type_enum NOT NULL,
    phone character varying NOT NULL,
    gender boolean NOT NULL,
    birthdate date NOT NULL
);


ALTER TABLE public.user_details OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 33384)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    status public.users_status_enum DEFAULT '1'::public.users_status_enum NOT NULL,
    roles public.users_roles_enum[] NOT NULL,
    user_detail_id uuid,
    enterprise_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3325 (class 2604 OID 33401)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
