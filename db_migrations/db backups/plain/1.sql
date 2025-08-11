--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-08-11 20:06:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 230 (class 1255 OID 41894)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 41814)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41813)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 222 (class 1259 OID 41828)
-- Name: color_themes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color_themes (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    data text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.color_themes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41827)
-- Name: color_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.color_themes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.color_themes_id_seq OWNER TO postgres;

--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 221
-- Name: color_themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.color_themes_id_seq OWNED BY public.color_themes.id;


--
-- TOC entry 228 (class 1259 OID 41862)
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    item_id integer NOT NULL,
    ismain boolean DEFAULT false NOT NULL,
    image_url character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.images OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 41861)
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO postgres;

--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 227
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- TOC entry 229 (class 1259 OID 41874)
-- Name: item_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_tag (
    item_id integer NOT NULL,
    tag_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.item_tag OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 41837)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41836)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 223
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- TOC entry 218 (class 1259 OID 41803)
-- Name: owners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owners (
    id integer NOT NULL,
    fname character varying(255) NOT NULL,
    lname character varying(255) NOT NULL,
    restaurant_name character varying(255) DEFAULT 'Restaurant'::character varying NOT NULL,
    logo_path character varying(255) DEFAULT 'nonset'::character varying,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    color_theme_id integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.owners OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 41802)
-- Name: owners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.owners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.owners_id_seq OWNER TO postgres;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 217
-- Name: owners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.owners_id_seq OWNED BY public.owners.id;


--
-- TOC entry 226 (class 1259 OID 41853)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    color character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 41852)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 225
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 4677 (class 2604 OID 41817)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 41831)
-- Name: color_themes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color_themes ALTER COLUMN id SET DEFAULT nextval('public.color_themes_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 41865)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 41840)
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- TOC entry 4671 (class 2604 OID 41806)
-- Name: owners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners ALTER COLUMN id SET DEFAULT nextval('public.owners_id_seq'::regclass);


--
-- TOC entry 4686 (class 2604 OID 41856)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4873 (class 0 OID 41814)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, owner_id, name, created_at, updated_at) FROM stdin;
1	8	Appetizers	2025-05-01 22:21:39.585205	2025-05-02 01:52:40.320913
2	8	Main Courses	2025-05-01 22:21:39.585205	2025-05-02 01:52:40.320913
7	1	Pizza	2025-05-08 01:55:22.319373	2025-05-08 01:55:22.319373
9	1	Pizza2	2025-06-24 12:38:05.701759	2025-06-24 12:38:05.701759
3	1	Desserts - حلويات	2025-05-01 22:21:39.585205	2025-07-18 18:07:14.349324
10	1	sandwiches	2025-07-20 16:57:18.978748	2025-07-20 16:57:18.978748
11	1	drinks	2025-07-20 17:00:08.845191	2025-07-20 17:00:08.845191
15	1	cccccccccccccccc	2025-07-26 22:08:40.908363	2025-07-26 22:10:43.972984
\.


--
-- TOC entry 4875 (class 0 OID 41828)
-- Dependencies: 222
-- Data for Name: color_themes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.color_themes (id, name, data, created_at, updated_at) FROM stdin;
2	Ocean Blue	{"primary": "#1976D2", "secondary": "#2196F3", "accent": "#BBDEFB"}	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
3	Earth Green	{"primary": "#388E3C", "secondary": "#4CAF50", "accent": "#C8E6C9"}	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
1	Classic Red	{\n  "primary-color": "#e74c3c",\n  "secondary-color": "#3498db",\n  "background-color": "#f9f9f9",\n  "text-color": "#333",\n  "light-text": "#777",\n  "border-color": "#ddd",\n  "card-bg": "#fff",\n  "header-bg": "#fff",\n  "category-active": "#e74c3c",\n  "border-radius": "8px"\n}\n	2025-05-14 00:35:12.248089	2025-07-03 00:50:48.988299
\.


--
-- TOC entry 4881 (class 0 OID 41862)
-- Dependencies: 228
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, item_id, ismain, image_url, created_at, updated_at) FROM stdin;
1	1	t	/images/items/bruschetta-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
2	1	f	/images/items/bruschetta-alt1.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
3	2	t	/images/items/calamari-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
4	3	t	/images/items/spinach-dip-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
5	3	f	/images/items/spinach-dip-alt1.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
6	4	t	/images/items/salmon-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
7	5	t	/images/items/filet-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
8	5	f	/images/items/filet-alt1.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
9	6	t	/images/items/lasagna-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
10	7	t	/images/items/lava-cake-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
11	8	t	/images/items/tiramisu-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
12	8	f	/images/items/tiramisu-alt1.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
13	9	t	/images/items/cheesecake-main.jpg	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
182	62	t	a93d9203-aca9-449d-928a-34fe6ea4bf41.jpg	2025-07-24 11:05:18.539625	2025-07-24 11:05:18.539625
186	68	t	4543a575-480d-4ed2-84bb-1e1ad47a979b.jpg	2025-07-25 18:37:31.680153	2025-07-25 18:37:31.680153
208	73	t	166b98bd-2032-4eb3-a885-78a1696ebe60.png	2025-08-03 21:19:58.075635	2025-08-03 21:19:58.075635
209	38	t	2ec8bb55-a838-402b-b07f-5b23f3c127fc.jpg	2025-08-09 20:43:07.422056	2025-08-09 20:43:07.422056
210	38	f	384abab2-4502-4c8a-89fa-d476fa220627.jpeg	2025-08-09 20:43:07.422056	2025-08-09 20:43:07.422056
211	38	f	011db902-2c94-4e2d-b53e-4f1875a3c107.jpeg	2025-08-09 20:43:07.422056	2025-08-09 20:43:07.422056
212	38	f	d9e95028-7d66-4024-bc17-790df4d12aa3.jpeg	2025-08-09 20:43:07.422056	2025-08-09 20:43:07.422056
125	45	f	4a7657aa-a2da-45a7-a604-fd70e119a178.jpg	2025-07-20 16:52:30.841758	2025-07-20 16:52:30.841758
\.


--
-- TOC entry 4882 (class 0 OID 41874)
-- Dependencies: 229
-- Data for Name: item_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_tag (item_id, tag_id, created_at) FROM stdin;
1	2	2025-05-14 00:35:12.248089
1	3	2025-05-14 00:35:12.248089
2	1	2025-05-14 00:35:12.248089
3	2	2025-05-14 00:35:12.248089
4	4	2025-05-14 00:35:12.248089
5	4	2025-05-14 00:35:12.248089
6	2	2025-05-14 00:35:12.248089
6	3	2025-05-14 00:35:12.248089
7	5	2025-05-14 00:35:12.248089
8	4	2025-05-14 00:35:12.248089
9	5	2025-05-14 00:35:12.248089
68	1	2025-07-25 18:37:31.680153
68	2	2025-07-25 18:37:31.680153
62	5	2025-08-01 19:30:44.072865
62	4	2025-08-01 19:30:44.072865
62	3	2025-08-01 19:30:44.072865
62	2	2025-08-01 19:30:44.072865
62	1	2025-08-01 19:30:44.072865
73	4	2025-08-03 21:19:58.075635
74	1	2025-08-10 01:17:10.362554
\.


--
-- TOC entry 4877 (class 0 OID 41837)
-- Dependencies: 224
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, description, price, category_id, created_at, updated_at) FROM stdin;
1	Bruschetta	Toasted bread topped with tomatoes, garlic, and fresh basil	8.99	1	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
2	Calamari	Crispy fried squid served with marinara sauce	10.99	1	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
3	Spinach Artichoke Dip	Creamy dip with spinach, artichokes, and melted cheese, served with tortilla chips	9.50	1	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
4	Grilled Salmon	Fresh Atlantic salmon with lemon butter sauce, served with seasonal vegetables	22.99	2	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
5	Filet Mignon	8oz tender beef filet with mashed potatoes and asparagus	34.99	2	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
6	Vegetable Lasagna	Layers of pasta, ricotta, mozzarella, and fresh vegetables	18.50	2	2025-05-01 22:21:39.585205	2025-05-01 22:21:39.585205
7	Chocolate Lava Cake	Warm chocolate cake with a molten center, served with vanilla ice cream	9.99	2	2025-05-01 22:21:39.585205	2025-05-17 11:31:43.619078
8	Tiramisu	Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream	8.50	2	2025-05-01 22:21:39.585205	2025-05-17 11:31:43.619078
9	Cheesecake	New York style cheesecake with strawberry topping	7.99	2	2025-05-01 22:21:39.585205	2025-05-17 11:31:43.619078
38	Margherita Pizza22	Classic pizza with tomato sauce and mozzarella	12.99	7	2025-05-17 08:11:02.794283	2025-05-17 11:32:50.293034
68	c2	c2	1.00	11	2025-07-25 18:37:31.680153	2025-07-25 18:37:31.680153
62	RC Cola	Coca-Cola	0.75	11	2025-07-23 20:18:16.343345	2025-08-01 19:30:44.072865
73	Konafa	I am konfa.\r\nCheese and sweet Crumbs	5.00	3	2025-08-03 21:19:58.075635	2025-08-03 21:19:58.075635
45	apple pie	apple pie	5.00	3	2025-07-20 16:52:30.841758	2025-08-03 21:22:29.944713
74	This is a long item name. item item item item item item	This is a long item name	26.00	3	2025-08-10 01:17:10.362554	2025-08-10 01:17:10.362554
\.


--
-- TOC entry 4871 (class 0 OID 41803)
-- Dependencies: 218
-- Data for Name: owners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.owners (id, fname, lname, restaurant_name, logo_path, username, password, created_at, updated_at, color_theme_id) FROM stdin;
7	abo	hadi2	Restaurant	nonset	owner2	$2b$12$tl1Zli7n2aApLi7ftplaWeJfWBUU1tL7TODhc9bu33p7AVyeJeHdu	2025-04-29 01:36:29.29871	2025-07-02 23:04:54.760473	1
8	John	Doe	Tasty Bites	/logos/tasty-bites.png	johndoe	hashed_password_123	2025-05-01 22:21:39.585205	2025-07-02 23:04:54.760473	1
13	abo	hadi6	Restaurant	nonset	owner6	$2b$12$8LdK7rtN.ddYz4SfyVFpVOIH52HCIA1EbTFgjazQ/dSEu5wNCf71K	2025-05-04 00:29:06.426801	2025-07-02 23:04:54.760473	1
14	abo	hadi6	Restaurant	nonset	owner66	$2b$12$2y/Gbcsc/3YJt1elF01BLOIHYHnCXPsOxzTgnqEs418Wb/01SRgai	2025-06-19 12:01:11.703455	2025-07-02 23:04:54.760473	1
15	abo	hadi6	Restaurant	nonset	owner67	$2b$12$i6.SOXmNRD/MpfAU9uu1f.tsd.dPKgE.wvYCgQDQIsFcoLUq1JvU6	2025-07-20 17:33:20.650506	2025-07-20 17:33:20.650506	1
1	abo	hadi	App Name	e4952960-7939-4693-ac7a-b13d443e08b8.jpg	owner1	$2b$12$MU.0Wikk1XeIJqhSyJ0lneLHaOuZCgHBQUaElBkRXzwjzOvsVGkS2	2025-04-29 01:04:15.402297	2025-08-10 00:32:34.885441	1
16	abo	hadi6	Restaurant	nonset	owner6700	$2b$12$OSjbUMZYWstAwYsDjxvWfOMX7bPRpako0AVAj5oM2AuU/vdPNvnLq	2025-08-01 17:22:01.896865	2025-08-01 17:22:01.896865	1
\.


--
-- TOC entry 4879 (class 0 OID 41853)
-- Dependencies: 226
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, color, created_at, updated_at) FROM stdin;
1	Spicy	#FF0000	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
2	Vegetarian	#00AA00	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
3	Gluten-Free	#0000FF	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
4	Chef's Recommendation	#FFA500	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
5	New	#FF69B4	2025-05-14 00:35:12.248089	2025-05-14 00:35:12.248089
\.


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 15, true);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 221
-- Name: color_themes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.color_themes_id_seq', 3, true);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 227
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 212, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 223
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 74, true);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 217
-- Name: owners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.owners_id_seq', 16, true);


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 225
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 5, true);


--
-- TOC entry 4697 (class 2606 OID 41821)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 41835)
-- Name: color_themes color_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color_themes
    ADD CONSTRAINT color_themes_pkey PRIMARY KEY (id);


--
-- TOC entry 4708 (class 2606 OID 41868)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 41878)
-- Name: item_tag item_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_tag
    ADD CONSTRAINT item_tag_pkey PRIMARY KEY (item_id, tag_id);


--
-- TOC entry 4703 (class 2606 OID 41846)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 41812)
-- Name: owners owners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_pkey PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 41860)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 1259 OID 41889)
-- Name: idx_categories_owner_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_categories_owner_id ON public.categories USING btree (owner_id);


--
-- TOC entry 4706 (class 1259 OID 41891)
-- Name: idx_images_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_images_item_id ON public.images USING btree (item_id);


--
-- TOC entry 4709 (class 1259 OID 41892)
-- Name: idx_item_tag_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_tag_item_id ON public.item_tag USING btree (item_id);


--
-- TOC entry 4710 (class 1259 OID 41893)
-- Name: idx_item_tag_tag_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_tag_tag_id ON public.item_tag USING btree (tag_id);


--
-- TOC entry 4701 (class 1259 OID 41890)
-- Name: idx_items_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_items_category_id ON public.items USING btree (category_id);


--
-- TOC entry 4720 (class 2620 OID 41896)
-- Name: categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4721 (class 2620 OID 41927)
-- Name: color_themes update_color_themes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_color_themes_updated_at BEFORE UPDATE ON public.color_themes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4724 (class 2620 OID 41928)
-- Name: images update_images_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4722 (class 2620 OID 41897)
-- Name: items update_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4719 (class 2620 OID 41895)
-- Name: owners update_owners_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON public.owners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4723 (class 2620 OID 41929)
-- Name: tags update_tags_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4714 (class 2606 OID 41915)
-- Name: categories categories_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owners(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4716 (class 2606 OID 41905)
-- Name: images images_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4717 (class 2606 OID 41942)
-- Name: item_tag item_tag_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_tag
    ADD CONSTRAINT item_tag_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4718 (class 2606 OID 41947)
-- Name: item_tag item_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_tag
    ADD CONSTRAINT item_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 4715 (class 2606 OID 41910)
-- Name: items items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4713 (class 2606 OID 41936)
-- Name: owners owners_color_theme_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_color_theme_fkey FOREIGN KEY (color_theme_id) REFERENCES public.color_themes(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- Completed on 2025-08-11 20:06:36

--
-- PostgreSQL database dump complete
--

